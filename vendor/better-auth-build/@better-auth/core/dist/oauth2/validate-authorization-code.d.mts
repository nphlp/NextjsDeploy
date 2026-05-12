import { ClientAssertionConfig } from "./client-assertion.mjs";
import { AwaitableFunction } from "../types/helper.mjs";
import { OAuth2Tokens, ProviderOptions } from "./oauth-provider.mjs";
import * as jose from "jose";

//#region src/oauth2/validate-authorization-code.d.ts
declare function authorizationCodeRequest({
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
}: {
  code: string;
  redirectURI: string;
  options: AwaitableFunction<Partial<ProviderOptions>>;
  codeVerifier?: string | undefined;
  deviceId?: string | undefined;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  clientAssertion?: ClientAssertionConfig | undefined; /** Token endpoint URL. Used as the JWT `aud` claim when signing assertions. */
  tokenEndpoint?: string | undefined;
  headers?: Record<string, string> | undefined;
  additionalParams?: Record<string, string> | undefined;
  resource?: (string | string[]) | undefined;
}): Promise<{
  body: URLSearchParams;
  headers: Record<string, any>;
}>;
/**
 * @deprecated use async'd authorizationCodeRequest instead
 */
declare function createAuthorizationCodeRequest({
  code,
  codeVerifier,
  redirectURI,
  options,
  authentication,
  deviceId,
  headers,
  additionalParams,
  resource
}: {
  code: string;
  redirectURI: string;
  options: Partial<ProviderOptions>;
  codeVerifier?: string | undefined;
  deviceId?: string | undefined;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  headers?: Record<string, string> | undefined;
  additionalParams?: Record<string, string> | undefined;
  resource?: (string | string[]) | undefined;
}): {
  body: URLSearchParams;
  headers: Record<string, any>;
};
declare function validateAuthorizationCode({
  code,
  codeVerifier,
  redirectURI,
  options,
  tokenEndpoint,
  authentication,
  clientAssertion,
  deviceId,
  headers,
  additionalParams,
  resource
}: {
  code: string;
  redirectURI: string;
  options: AwaitableFunction<Partial<ProviderOptions>>;
  codeVerifier?: string | undefined;
  deviceId?: string | undefined;
  tokenEndpoint: string;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  clientAssertion?: ClientAssertionConfig | undefined;
  headers?: Record<string, string> | undefined;
  additionalParams?: Record<string, string> | undefined;
  resource?: (string | string[]) | undefined;
}): Promise<OAuth2Tokens>;
declare function validateToken(token: string, jwksEndpoint: string, options?: {
  audience?: string | string[];
  issuer?: string | string[];
}): Promise<jose.JWTVerifyResult<jose.JWTPayload> & jose.ResolvedKey>;
//#endregion
export { authorizationCodeRequest, createAuthorizationCodeRequest, validateAuthorizationCode, validateToken };