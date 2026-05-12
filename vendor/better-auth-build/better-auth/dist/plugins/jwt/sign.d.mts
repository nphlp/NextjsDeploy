import { JwtOptions, ResolvedSigningKey } from "./types.mjs";
import { GenericEndpointContext } from "@better-auth/core";

//#region src/plugins/jwt/sign.d.ts
type JWTPayloadWithOptional = {
  /**
   * JWT Issuer
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
   */
  iss?: string | undefined;
  /**
   * JWT Subject
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
   */
  sub?: string | undefined;
  /**
   * JWT Audience
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
   */
  aud?: string | string[] | undefined;
  /**
   * JWT ID
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
   */
  jti?: string | undefined;
  /**
   * JWT Not Before
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
   */
  nbf?: number | undefined;
  /**
   * JWT Expiration Time
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
   */
  exp?: number | undefined;
  /**
   * JWT Issued At
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
   */
  iat?: number | undefined; /** Any other JWT Claim Set member. */
  [propName: string]: unknown | undefined;
};
/**
 * Resolves the JWKS signing key, decrypts it, and imports it
 * for use with jose's SignJWT. Returns null when signing is
 * delegated to a custom jwt.sign callback.
 *
 * Callers that need the signing algorithm before constructing
 * the JWT payload (e.g. for OIDC at_hash) should call this
 * first, read `.alg`, then pass the result to `signJWT` via
 * the `resolvedKey` option to avoid a redundant DB lookup.
 */
declare function resolveSigningKey(ctx: GenericEndpointContext, options?: JwtOptions): Promise<ResolvedSigningKey | null>;
declare function signJWT(ctx: GenericEndpointContext, config: {
  options?: JwtOptions | undefined;
  payload: JWTPayloadWithOptional; /** Pre-resolved key from resolveSigningKey. Skips redundant DB lookup. */
  resolvedKey?: ResolvedSigningKey;
}): Promise<string>;
declare function getJwtToken(ctx: GenericEndpointContext, options?: JwtOptions | undefined): Promise<string>;
//#endregion
export { getJwtToken, resolveSigningKey, signJWT };