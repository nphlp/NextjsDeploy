import { PACKAGE_VERSION } from "../../version.mjs";
import { GENERIC_OAUTH_ERROR_CODES } from "./error-codes.mjs";
import { auth0 } from "./providers/auth0.mjs";
import { gumroad } from "./providers/gumroad.mjs";
import { hubspot } from "./providers/hubspot.mjs";
import { keycloak } from "./providers/keycloak.mjs";
import { line } from "./providers/line.mjs";
import { microsoftEntraId } from "./providers/microsoft-entra-id.mjs";
import { okta } from "./providers/okta.mjs";
import { patreon } from "./providers/patreon.mjs";
import { slack } from "./providers/slack.mjs";
import { APIError } from "@better-auth/core/error";
import { createAuthorizationURL, refreshAccessToken, validateAuthorizationCode } from "@better-auth/core/oauth2";
import { decodeJwt } from "jose";
import { betterFetch } from "@better-fetch/fetch";
//#region src/plugins/generic-oauth/index.ts
function buildClientAssertion(config, tokenEndpoint) {
	if (config.authentication !== "private_key_jwt" || !config.clientAssertion) return;
	return {
		...config.clientAssertion,
		tokenEndpoint
	};
}
async function fetchDiscovery(url, headers) {
	const result = await betterFetch(url, {
		method: "GET",
		headers
	});
	if (result.error || !result.data) return null;
	if (result.data.issuer) try {
		new URL(result.data.issuer);
	} catch {
		return null;
	}
	return result.data;
}
async function fetchUserInfo(tokens, userInfoUrl) {
	if (tokens.idToken) try {
		const decoded = decodeJwt(tokens.idToken);
		if (decoded?.sub && decoded?.email) return {
			id: decoded.sub,
			emailVerified: decoded.email_verified,
			image: decoded.picture,
			...decoded
		};
	} catch {}
	if (!userInfoUrl) return null;
	const userInfo = await betterFetch(userInfoUrl, {
		method: "GET",
		headers: { Authorization: `Bearer ${tokens.accessToken}` }
	});
	if (userInfo.error || !userInfo.data) return null;
	const data = userInfo.data;
	return {
		...data,
		id: data.sub ?? data.id ?? "",
		emailVerified: data.email_verified ?? false,
		email: data.email,
		image: data.picture,
		name: data.name
	};
}
/**
* A generic OAuth plugin that registers any OAuth/OIDC provider
* as a first-class social provider.
*
* Providers are used through the standard `signIn.social` and
* `callback/:id` core endpoints — no plugin-specific endpoints needed.
*/
const genericOAuth = (options) => {
	const seenIds = /* @__PURE__ */ new Set();
	const nonUniqueIds = /* @__PURE__ */ new Set();
	for (const config of options.config) {
		const id = config.providerId;
		if (seenIds.has(id)) nonUniqueIds.add(id);
		seenIds.add(id);
	}
	if (nonUniqueIds.size > 0) console.warn(`Duplicate provider IDs found: ${Array.from(nonUniqueIds).join(", ")}`);
	return {
		id: "generic-oauth",
		version: PACKAGE_VERSION,
		init: async (ctx) => {
			const genericProviders = [];
			for (const c of options.config) {
				let authorizationUrl = c.authorizationUrl;
				let tokenUrl = c.tokenUrl;
				let userInfoUrl = c.userInfoUrl;
				let issuer;
				let isOidc = false;
				if (c.discoveryUrl) {
					const discovered = await fetchDiscovery(c.discoveryUrl, c.discoveryHeaders).catch((err) => {
						ctx.logger.error(`Discovery fetch failed for "${c.providerId}": ${err}`);
						return null;
					});
					if (discovered) {
						authorizationUrl ??= discovered.authorization_endpoint;
						tokenUrl ??= discovered.token_endpoint;
						userInfoUrl ??= discovered.userinfo_endpoint;
						issuer = discovered.issuer;
						isOidc = Array.isArray(discovered.id_token_signing_alg_values_supported) && discovered.id_token_signing_alg_values_supported.length > 0;
					} else if (!authorizationUrl || !tokenUrl) ctx.logger.error(`Provider "${c.providerId}": discovery returned no data and no explicit endpoints configured. OAuth sign-in will fail for this provider.`);
				}
				if (!c.clientSecret && !c.clientAssertion && c.authentication !== "private_key_jwt") ctx.logger.warn(`Provider "${c.providerId}": no clientSecret or clientAssertion configured. Token exchange will fail unless this is a public client.`);
				genericProviders.push({
					id: c.providerId,
					name: c.name ?? c.providerId,
					issuer,
					createAuthorizationURL(data) {
						if (!authorizationUrl) throw APIError.from("BAD_REQUEST", GENERIC_OAUTH_ERROR_CODES.INVALID_OAUTH_CONFIGURATION);
						return createAuthorizationURL({
							id: c.providerId,
							options: {
								clientId: c.clientId,
								clientSecret: c.clientSecret,
								redirectURI: c.redirectURI
							},
							authorizationEndpoint: authorizationUrl,
							state: data.state,
							codeVerifier: c.pkce ?? true ? data.codeVerifier : void 0,
							scopes: (() => {
								const merged = [...data.scopes ?? [], ...c.scopes ?? []];
								if (isOidc && !merged.includes("openid")) merged.unshift("openid");
								return merged;
							})(),
							redirectURI: data.redirectURI,
							prompt: c.prompt,
							accessType: c.accessType,
							responseType: c.responseType,
							responseMode: c.responseMode,
							additionalParams: c.authorizationUrlParams,
							loginHint: data.loginHint
						});
					},
					async validateAuthorizationCode(data) {
						if (c.getToken) return c.getToken(data);
						if (!tokenUrl) throw APIError.from("BAD_REQUEST", GENERIC_OAUTH_ERROR_CODES.TOKEN_URL_NOT_FOUND);
						return validateAuthorizationCode({
							headers: c.authorizationHeaders,
							code: data.code,
							codeVerifier: c.pkce ?? true ? data.codeVerifier : void 0,
							redirectURI: data.redirectURI,
							options: {
								clientId: c.clientId,
								clientSecret: c.clientSecret,
								redirectURI: c.redirectURI
							},
							tokenEndpoint: tokenUrl,
							authentication: c.authentication,
							additionalParams: c.tokenUrlParams,
							clientAssertion: buildClientAssertion(c, tokenUrl)
						});
					},
					async getUserInfo(tokens) {
						const raw = c.getUserInfo ? await c.getUserInfo(tokens) : await fetchUserInfo(tokens, userInfoUrl);
						if (!raw) return null;
						const mapped = c.mapProfileToUser ? await c.mapProfileToUser(raw) : {};
						const user = {
							id: raw.id,
							email: raw.email,
							emailVerified: raw.emailVerified,
							image: raw.image,
							name: raw.name,
							...mapped
						};
						return {
							user: {
								...user,
								image: user.image ?? void 0
							},
							data: raw
						};
					},
					async refreshAccessToken(refreshToken) {
						if (!tokenUrl) throw APIError.from("BAD_REQUEST", GENERIC_OAUTH_ERROR_CODES.TOKEN_URL_NOT_FOUND);
						return refreshAccessToken({
							refreshToken,
							options: {
								clientId: c.clientId,
								clientSecret: c.clientSecret
							},
							authentication: c.authentication,
							clientAssertion: buildClientAssertion(c, tokenUrl),
							tokenEndpoint: tokenUrl
						});
					},
					disableImplicitSignUp: c.disableImplicitSignUp,
					disableSignUp: c.disableSignUp,
					options: {
						disableSignUp: c.disableSignUp,
						overrideUserInfoOnSignIn: c.overrideUserInfo
					}
				});
			}
			const existingIds = new Set(ctx.socialProviders.map((p) => p.id));
			for (const gp of genericProviders) if (existingIds.has(gp.id)) ctx.logger.warn(`Generic OAuth provider "${gp.id}" shadows a built-in social provider with the same ID`);
			return { context: { socialProviders: genericProviders.concat(ctx.socialProviders) } };
		},
		options,
		$ERROR_CODES: GENERIC_OAUTH_ERROR_CODES
	};
};
//#endregion
export { auth0, genericOAuth, gumroad, hubspot, keycloak, line, microsoftEntraId, okta, patreon, slack };
