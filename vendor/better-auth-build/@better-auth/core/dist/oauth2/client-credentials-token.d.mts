import { ClientAssertionConfig } from "./client-assertion.mjs";
import { AwaitableFunction } from "../types/helper.mjs";
import { OAuth2Tokens, ProviderOptions } from "./oauth-provider.mjs";

//#region src/oauth2/client-credentials-token.d.ts
declare function clientCredentialsTokenRequest({
  options,
  scope,
  authentication,
  clientAssertion,
  tokenEndpoint,
  resource
}: {
  options: AwaitableFunction<ProviderOptions>;
  scope?: string | undefined;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  clientAssertion?: ClientAssertionConfig | undefined; /** Token endpoint URL. Used as the JWT `aud` claim when signing assertions. */
  tokenEndpoint?: string | undefined;
  resource?: (string | string[]) | undefined;
}): Promise<{
  body: URLSearchParams;
  headers: Record<string, any>;
}>;
/**
 * @deprecated use async'd clientCredentialsTokenRequest instead
 */
declare function createClientCredentialsTokenRequest({
  options,
  scope,
  authentication,
  resource,
  extraParams
}: {
  options: ProviderOptions;
  scope?: string | undefined;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  resource?: (string | string[]) | undefined;
  extraParams?: Record<string, string> | undefined;
}): {
  body: URLSearchParams;
  headers: Record<string, any>;
};
declare function clientCredentialsToken({
  options,
  tokenEndpoint,
  scope,
  authentication,
  clientAssertion,
  resource
}: {
  options: AwaitableFunction<ProviderOptions>;
  tokenEndpoint: string;
  scope: string;
  authentication?: ("basic" | "post" | "private_key_jwt") | undefined;
  clientAssertion?: ClientAssertionConfig | undefined;
  resource?: (string | string[]) | undefined;
}): Promise<OAuth2Tokens>;
//#endregion
export { clientCredentialsToken, clientCredentialsTokenRequest, createClientCredentialsTokenRequest };