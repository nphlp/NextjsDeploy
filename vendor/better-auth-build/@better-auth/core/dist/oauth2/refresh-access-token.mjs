import { resolveAssertionParams } from "./client-assertion.mjs";
import { betterFetch } from "@better-fetch/fetch";
import { base64 } from "@better-auth/utils/base64";
//#region src/oauth2/refresh-access-token.ts
async function refreshAccessTokenRequest({ refreshToken, options, authentication, clientAssertion, tokenEndpoint, extraParams, resource }) {
	options = typeof options === "function" ? await options() : options;
	if (authentication === "private_key_jwt") {
		if (!clientAssertion) throw new Error("private_key_jwt authentication requires a clientAssertion configuration");
		const assertionParams = await resolveAssertionParams({
			clientAssertion,
			clientId: Array.isArray(options.clientId) ? options.clientId[0] : options.clientId,
			tokenEndpoint
		});
		extraParams = {
			...extraParams,
			...assertionParams
		};
	}
	return createRefreshAccessTokenRequest({
		refreshToken,
		options,
		authentication,
		extraParams,
		resource
	});
}
/**
* @deprecated use async'd refreshAccessTokenRequest instead
*/
function createRefreshAccessTokenRequest({ refreshToken, options, authentication, extraParams, resource }) {
	const body = new URLSearchParams();
	const headers = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json"
	};
	body.set("grant_type", "refresh_token");
	body.set("refresh_token", refreshToken);
	const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
	if (authentication === "basic") if (primaryClientId) headers["authorization"] = "Basic " + base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`);
	else headers["authorization"] = "Basic " + base64.encode(`:${options.clientSecret ?? ""}`);
	else {
		body.set("client_id", primaryClientId);
		if (authentication !== "private_key_jwt" && options.clientSecret) body.set("client_secret", options.clientSecret);
	}
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	if (extraParams) for (const [key, value] of Object.entries(extraParams)) body.set(key, value);
	return {
		body,
		headers
	};
}
async function refreshAccessToken({ refreshToken, options, tokenEndpoint, authentication, clientAssertion, extraParams }) {
	const { body, headers } = await refreshAccessTokenRequest({
		refreshToken,
		options,
		authentication,
		clientAssertion,
		tokenEndpoint,
		extraParams
	});
	const { data, error } = await betterFetch(tokenEndpoint, {
		method: "POST",
		body,
		headers
	});
	if (error) throw error;
	const tokens = {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		tokenType: data.token_type,
		scopes: data.scope?.split(" "),
		idToken: data.id_token
	};
	if (data.expires_in) {
		const now = /* @__PURE__ */ new Date();
		tokens.accessTokenExpiresAt = new Date(now.getTime() + data.expires_in * 1e3);
	}
	if (data.refresh_token_expires_in) {
		const now = /* @__PURE__ */ new Date();
		tokens.refreshTokenExpiresAt = new Date(now.getTime() + data.refresh_token_expires_in * 1e3);
	}
	return tokens;
}
//#endregion
export { createRefreshAccessTokenRequest, refreshAccessToken, refreshAccessTokenRequest };
