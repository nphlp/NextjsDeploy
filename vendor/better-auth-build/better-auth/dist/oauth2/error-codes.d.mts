//#region src/oauth2/error-codes.d.ts
/**
 * Error codes used in OAuth callback redirects (`?error=<code>`).
 * These are URL-safe strings, not API error objects.
 */
declare const OAUTH_CALLBACK_ERROR_CODES: {
  readonly NO_CODE: "no_code";
  readonly PROVIDER_NOT_FOUND: "oauth_provider_not_found";
  readonly ISSUER_MISSING: "issuer_missing";
  readonly ISSUER_MISMATCH: "issuer_mismatch";
  readonly INVALID_CODE: "invalid_code";
  readonly UNABLE_TO_GET_USER_INFO: "unable_to_get_user_info";
  readonly NO_CALLBACK_URL: "no_callback_url";
  readonly UNABLE_TO_LINK_ACCOUNT: "unable_to_link_account";
  readonly EMAIL_DOES_NOT_MATCH: "email_does_not_match";
  readonly ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER: "account_already_linked_to_different_user";
  readonly EMAIL_NOT_FOUND: "email_not_found";
};
//#endregion
export { OAUTH_CALLBACK_ERROR_CODES };