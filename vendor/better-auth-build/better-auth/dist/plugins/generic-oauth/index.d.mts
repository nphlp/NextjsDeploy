import { GenericOAuthConfig, GenericOAuthOptions } from "./types.mjs";
import { Auth0Options, auth0 } from "./providers/auth0.mjs";
import { GumroadOptions, gumroad } from "./providers/gumroad.mjs";
import { HubSpotOptions, hubspot } from "./providers/hubspot.mjs";
import { KeycloakOptions, keycloak } from "./providers/keycloak.mjs";
import { LineOptions, line } from "./providers/line.mjs";
import { MicrosoftEntraIdOptions, microsoftEntraId } from "./providers/microsoft-entra-id.mjs";
import { OktaOptions, okta } from "./providers/okta.mjs";
import { PatreonOptions, patreon } from "./providers/patreon.mjs";
import { SlackOptions, slack } from "./providers/slack.mjs";
import { AuthContext } from "@better-auth/core";
import * as _better_auth_core_oauth20 from "@better-auth/core/oauth2";
import { OAuthProvider } from "@better-auth/core/oauth2";
import * as _better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/generic-oauth/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "generic-oauth": {
      creator: typeof genericOAuth;
    };
  }
}
/**
 * Base type for OAuth provider options.
 * Extracts common fields from GenericOAuthConfig and makes clientSecret required.
 */
type BaseOAuthProviderOptions = Omit<Pick<GenericOAuthConfig, "clientId" | "clientSecret" | "scopes" | "redirectURI" | "pkce" | "disableImplicitSignUp" | "disableSignUp" | "overrideUserInfo">, "clientSecret"> & {
  /** OAuth client secret (required for provider options) */clientSecret: string;
};
/**
 * A generic OAuth plugin that registers any OAuth/OIDC provider
 * as a first-class social provider.
 *
 * Providers are used through the standard `signIn.social` and
 * `callback/:id` core endpoints — no plugin-specific endpoints needed.
 */
declare const genericOAuth: <const ID extends string>(options: GenericOAuthOptions<ID>) => {
  id: "generic-oauth";
  version: string;
  init: (ctx: AuthContext) => Promise<{
    context: {
      socialProviders: OAuthProvider<Record<string, any>, Partial<_better_auth_core_oauth20.ProviderOptions<any>>>[];
    };
  }>;
  options: GenericOAuthOptions<ID>;
  $ERROR_CODES: {
    INVALID_OAUTH_CONFIGURATION: _better_auth_core_utils_error_codes0.RawError<"INVALID_OAUTH_CONFIGURATION">;
    TOKEN_URL_NOT_FOUND: _better_auth_core_utils_error_codes0.RawError<"TOKEN_URL_NOT_FOUND">;
  };
};
//#endregion
export { Auth0Options, BaseOAuthProviderOptions, type GenericOAuthConfig, type GenericOAuthOptions, GumroadOptions, HubSpotOptions, KeycloakOptions, LineOptions, MicrosoftEntraIdOptions, OktaOptions, PatreonOptions, SlackOptions, auth0, genericOAuth, gumroad, hubspot, keycloak, line, microsoftEntraId, okta, patreon, slack };