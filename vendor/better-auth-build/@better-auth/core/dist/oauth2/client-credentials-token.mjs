import { resolveAssertionParams } from "./client-assertion.mjs";
import { betterFetch } from "@better-fetch/fetch";
import { base64 } from "@better-auth/utils/base64";
//#region src/oauth2/client-credentials-token.ts
async function clientCredentialsTokenRequest({ options, scope, authentication, clientAssertion, tokenEndpoint, resource }) {
	options = typeof options === "function" ? await options() : options;
	let extraParams;
	if (authentication === "private_key_jwt") {
		if (!clientAssertion) throw new Error("private_key_jwt authentication requires a clientAssertion configuration");
		extraParams = await resolveAssertionParams({
			clientAssertion,
			clientId: Array.isArray(options.clientId) ? options.clientId[0] : options.clientId,
			tokenEndpoint
		});
	}
	return createClientCredentialsTokenRequest({
		options,
		scope,
		authentication,
		resource,
		extraParams
	});
}
/**
* @deprecated use async'd clientCredentialsTokenRequest instead
*/
function createClientCredentialsTokenRequest({ options, scope, authentication, resource, extraParams }) {
	const body = new URLSearchParams();
	const headers = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json"
	};
	body.set("grant_type", "client_credentials");
	scope && body.set("scope", scope);
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
	if (authentication === "basic") headers["authorization"] = `Basic ${base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`)}`;
	else {
		body.set("client_id", primaryClientId);
		if (authentication !== "private_key_jwt" && options.clientSecret) body.set("client_secret", options.clientSecret);
	}
	if (extraParams) {
		for (const [key, value] of Object.entries(extraParams)) if (!body.has(key)) body.append(key, value);
	}
	return {
		body,
		headers
	};
}
async function clientCredentialsToken({ options, tokenEndpoint, scope, authentication, clientAssertion, resource }) {
	const { body, headers } = await clientCredentialsTokenRequest({
		options,
		scope,
		authentication,
		clientAssertion,
		tokenEndpoint,
		resource
	});
	const { data, error } = await betterFetch(tokenEndpoint, {
		method: "POST",
		body,
		headers
	});
	if (error) throw error;
	const tokens = {
		accessToken: data.access_token,
		tokenType: data.token_type,
		scopes: data.scope?.split(" ")
	};
	if (data.expires_in) {
		const now = /* @__PURE__ */ new Date();
		tokens.accessTokenExpiresAt = new Date(now.getTime() + data.expires_in * 1e3);
	}
	return tokens;
}
//#endregion
export { clientCredentialsToken, clientCredentialsTokenRequest, createClientCredentialsTokenRequest };
