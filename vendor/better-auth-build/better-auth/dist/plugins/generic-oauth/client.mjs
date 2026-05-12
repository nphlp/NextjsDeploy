import "../../oauth2/error-codes.mjs";
import { PACKAGE_VERSION } from "../../version.mjs";
import { GENERIC_OAUTH_ERROR_CODES } from "./error-codes.mjs";
//#region src/plugins/generic-oauth/client.ts
/**
* @deprecated No longer needed. Generic OAuth providers now use the standard
* `signIn.social` flow and require no client plugin. Remove this from your
* client plugin list.
*/
const genericOAuthClient = () => {
	return {
		id: "generic-oauth-client",
		version: PACKAGE_VERSION,
		$InferServerPlugin: {},
		$ERROR_CODES: GENERIC_OAUTH_ERROR_CODES
	};
};
//#endregion
export { genericOAuthClient };
