import { resolveAssertionParams } from "./client-assertion.mjs";
import { getOAuth2Tokens } from "./utils.mjs";
import { betterFetch } from "@better-fetch/fetch";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { base64 } from "@better-auth/utils/base64";
//#region src/oauth2/validate-authorization-code.ts
async function authorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, clientAssertion, tokenEndpoint, deviceId, headers, additionalParams = {}, resource }) {
	options = typeof options === "function" ? await options() : options;
	if (authentication === "private_key_jwt") {
		if (!clientAssertion) throw new Error("private_key_jwt authentication requires a clientAssertion configuration");
		const assertionParams = await resolveAssertionParams({
			clientAssertion,
			clientId: Array.isArray(options.clientId) ? options.clientId[0] : options.clientId,
			tokenEndpoint
		});
		additionalParams = {
			...additionalParams,
			...assertionParams
		};
	}
	return createAuthorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		authentication,
		deviceId,
		headers,
		additionalParams,
		resource
	});
}
/**
* @deprecated use async'd authorizationCodeRequest instead
*/
function createAuthorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, deviceId, headers, additionalParams = {}, resource }) {
	const body = new URLSearchParams();
	const requestHeaders = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json",
		...headers
	};
	body.set("grant_type", "authorization_code");
	body.set("code", code);
	codeVerifier && body.set("code_verifier", codeVerifier);
	options.clientKey && body.set("client_key", options.clientKey);
	deviceId && body.set("device_id", deviceId);
	body.set("redirect_uri", options.redirectURI || redirectURI);
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
	if (authentication === "basic") requestHeaders["authorization"] = `Basic ${base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`)}`;
	else {
		body.set("client_id", primaryClientId);
		if (authentication !== "private_key_jwt" && options.clientSecret) body.set("client_secret", options.clientSecret);
	}
	for (const [key, value] of Object.entries(additionalParams)) if (!body.has(key)) body.append(key, value);
	return {
		body,
		headers: requestHeaders
	};
}
async function validateAuthorizationCode({ code, codeVerifier, redirectURI, options, tokenEndpoint, authentication, clientAssertion, deviceId, headers, additionalParams = {}, resource }) {
	const { body, headers: requestHeaders } = await authorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		authentication,
		clientAssertion,
		tokenEndpoint,
		deviceId,
		headers,
		additionalParams,
		resource
	});
	const { data, error } = await betterFetch(tokenEndpoint, {
		method: "POST",
		body,
		headers: requestHeaders
	});
	if (error) throw error;
	return getOAuth2Tokens(data);
}
async function validateToken(token, jwksEndpoint, options) {
	return await jwtVerify(token, createRemoteJWKSet(new URL(jwksEndpoint)), {
		audience: options?.audience,
		issuer: options?.issuer
	});
}
//#endregion
export { authorizationCodeRequest, createAuthorizationCodeRequest, validateAuthorizationCode, validateToken };
