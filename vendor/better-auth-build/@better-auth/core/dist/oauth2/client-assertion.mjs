import { SignJWT, importJWK, importPKCS8 } from "jose";
//#region src/oauth2/client-assertion.ts
/** Asymmetric signing algorithms compatible with private_key_jwt (RFC 7523). */
const ASSERTION_SIGNING_ALGORITHMS = [
	"RS256",
	"RS384",
	"RS512",
	"PS256",
	"PS384",
	"PS512",
	"ES256",
	"ES384",
	"ES512",
	"EdDSA"
];
const CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
/**
* Signs an RFC 7523 client assertion JWT for `private_key_jwt` authentication.
*
* The JWT contains: iss=clientId, sub=clientId, aud=tokenEndpoint,
* exp=now+120s, jti=unique, iat=now.
*/
async function signClientAssertion({ clientId, tokenEndpoint, privateKeyJwk, privateKeyPem, kid, algorithm, expiresIn = 120 }) {
	const resolvedKid = kid ?? privateKeyJwk?.kid;
	const resolvedAlg = algorithm ?? privateKeyJwk?.alg ?? "RS256";
	let key;
	if (privateKeyJwk) key = await importJWK(privateKeyJwk, resolvedAlg);
	else if (privateKeyPem) key = await importPKCS8(privateKeyPem, resolvedAlg);
	else throw new Error("private_key_jwt requires either privateKeyJwk or privateKeyPem");
	const now = Math.floor(Date.now() / 1e3);
	const jti = crypto.randomUUID();
	const header = {
		alg: resolvedAlg,
		typ: "JWT"
	};
	if (resolvedKid) header.kid = resolvedKid;
	return new SignJWT({}).setProtectedHeader(header).setIssuer(clientId).setSubject(clientId).setAudience(tokenEndpoint).setIssuedAt(now).setExpirationTime(now + expiresIn).setJti(jti).sign(key);
}
/**
* Resolves a ClientAssertionConfig into `client_assertion` + `client_assertion_type`
* params for injection into a token request body.
*/
async function resolveAssertionParams({ clientAssertion, clientId, tokenEndpoint }) {
	let assertion = clientAssertion.assertion;
	if (!assertion) {
		const audEndpoint = tokenEndpoint ?? clientAssertion.tokenEndpoint;
		if (!audEndpoint) throw new Error("private_key_jwt requires a tokenEndpoint for the JWT audience claim");
		assertion = await signClientAssertion({
			clientId,
			tokenEndpoint: audEndpoint,
			privateKeyJwk: clientAssertion.privateKeyJwk,
			privateKeyPem: clientAssertion.privateKeyPem,
			kid: clientAssertion.kid,
			algorithm: clientAssertion.algorithm,
			expiresIn: clientAssertion.expiresIn
		});
	}
	return {
		client_assertion: assertion,
		client_assertion_type: CLIENT_ASSERTION_TYPE
	};
}
//#endregion
export { ASSERTION_SIGNING_ALGORITHMS, CLIENT_ASSERTION_TYPE, resolveAssertionParams, signClientAssertion };
