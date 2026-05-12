import { OAUTH_CALLBACK_ERROR_CODES } from "../../oauth2/error-codes.mjs";
import * as _better_auth_core_utils_error_codes0 from "@better-auth/core/utils/error-codes";

//#region src/plugins/generic-oauth/error-codes.d.ts
declare const GENERIC_OAUTH_ERROR_CODES: {
  INVALID_OAUTH_CONFIGURATION: _better_auth_core_utils_error_codes0.RawError<"INVALID_OAUTH_CONFIGURATION">;
  TOKEN_URL_NOT_FOUND: _better_auth_core_utils_error_codes0.RawError<"TOKEN_URL_NOT_FOUND">;
};
//#endregion
export { GENERIC_OAUTH_ERROR_CODES };