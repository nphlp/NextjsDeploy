//#region src/oauth2/client-assertion.d.ts
/** Asymmetric signing algorithms compatible with private_key_jwt (RFC 7523). */
declare const ASSERTION_SIGNING_ALGORITHMS: readonly ["RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512", "EdDSA"];
type AssertionSigningAlgorithm = (typeof ASSERTION_SIGNING_ALGORITHMS)[number];
declare const CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
interface ClientAssertionConfig {
  /** Pre-signed JWT assertion string. If provided, signing is skipped. */
  assertion?: string;
  /** Private key in JWK format for signing. */
  privateKeyJwk?: JsonWebKey;
  /** Private key in PKCS#8 PEM format for signing. */
  privateKeyPem?: string;
  /** Key ID to include in the JWT header. */
  kid?: string;
  /** Asymmetric signing algorithm. Symmetric algorithms (HS256) and "none" are not allowed. @default "RS256" */
  algorithm?: AssertionSigningAlgorithm;
  /** Token endpoint URL (used as the JWT `aud` claim). */
  tokenEndpoint?: string;
  /** Assertion lifetime in seconds. @default 120 */
  expiresIn?: number;
}
/**
 * Signs an RFC 7523 client assertion JWT for `private_key_jwt` authentication.
 *
 * The JWT contains: iss=clientId, sub=clientId, aud=tokenEndpoint,
 * exp=now+120s, jti=unique, iat=now.
 */
declare function signClientAssertion({
  clientId,
  tokenEndpoint,
  privateKeyJwk,
  privateKeyPem,
  kid,
  algorithm,
  expiresIn
}: {
  clientId: string;
  tokenEndpoint: string;
  privateKeyJwk?: JsonWebKey;
  privateKeyPem?: string;
  kid?: string;
  algorithm?: AssertionSigningAlgorithm;
  expiresIn?: number;
}): Promise<string>;
/**
 * Resolves a ClientAssertionConfig into `client_assertion` + `client_assertion_type`
 * params for injection into a token request body.
 */
declare function resolveAssertionParams({
  clientAssertion,
  clientId,
  tokenEndpoint
}: {
  clientAssertion: ClientAssertionConfig;
  clientId: string;
  tokenEndpoint?: string;
}): Promise<Record<string, string>>;
//#endregion
export { ASSERTION_SIGNING_ALGORITHMS, AssertionSigningAlgorithm, CLIENT_ASSERTION_TYPE, ClientAssertionConfig, resolveAssertionParams, signClientAssertion };