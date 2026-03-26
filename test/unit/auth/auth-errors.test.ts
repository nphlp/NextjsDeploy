import { isValidationError, translateAuthError } from "@lib/auth-errors";
import { describe, expect, it } from "vitest";

describe("translateAuthError", () => {
    it("translates EMAIL_INVALID", () => {
        expect(translateAuthError("EMAIL_INVALID")).toBe("Ce domaine email n'est pas autorisé.");
    });

    it("translates PASSWORD_MISSING", () => {
        expect(translateAuthError("PASSWORD_MISSING")).toBe("Le mot de passe est requis.");
    });

    it("translates PASSWORD_INVALID", () => {
        expect(translateAuthError("PASSWORD_INVALID")).toBe(
            "Le mot de passe ne respecte pas les critères de sécurité.",
        );
    });

    it("translates PASSWORD_COMPROMISED", () => {
        expect(translateAuthError("PASSWORD_COMPROMISED")).toContain("compromis");
    });

    it("translates 'New email is the same as the old email'", () => {
        expect(translateAuthError("New email is the same as the old email")).toContain("identique");
    });

    it("translates EMAIL_CHANGE_CANCELED", () => {
        expect(translateAuthError("EMAIL_CHANGE_CANCELED")).toContain("annulé");
    });

    it("falls back to raw message for unknown codes", () => {
        expect(translateAuthError("SOME_UNKNOWN_ERROR")).toBe("SOME_UNKNOWN_ERROR");
    });

    it("returns default error for undefined message", () => {
        expect(translateAuthError(undefined)).toBe("Une erreur est survenue. Veuillez réessayer.");
    });
});

describe("isValidationError", () => {
    it("returns true for known validation errors", () => {
        expect(isValidationError("EMAIL_INVALID")).toBe(true);
        expect(isValidationError("PASSWORD_MISSING")).toBe(true);
        expect(isValidationError("PASSWORD_INVALID")).toBe(true);
        expect(isValidationError("PASSWORD_COMPROMISED")).toBe(true);
        expect(isValidationError("EMAIL_CHANGE_CANCELED")).toBe(true);
    });

    it("returns false for unknown errors (non-validation / enumeration)", () => {
        expect(isValidationError("User not found")).toBe(false);
        expect(isValidationError("Email already in use")).toBe(false);
        expect(isValidationError("SOME_UNKNOWN_ERROR")).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isValidationError(undefined)).toBe(false);
    });
});
