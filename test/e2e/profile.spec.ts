import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";

const timestamp = Date.now();
const credentials = {
    email: `test-profile-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

const newPassword = "NewSecurePass456!!";

test.describe.serial("Profile", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("auth guard redirects to login", async ({ page }) => {
        await page.goto("/profile");
        await page.waitForURL(/\/login\?redirect=/);
        await expect(page).toHaveURL("/login?redirect=%2Fprofile");
    });

    test("profile tab: page accessible with user info", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Navigate to Profile tab
        await page.goto("/profile");

        // Assert heading and user info
        await expect(page.getByRole("heading", { name: "Profil" })).toBeVisible();
        await expect(page.getByRole("tabpanel").getByText(credentials.email)).toBeVisible();

        // Navigate to Edition tab
        await page.goto("/profile?tab=edition");
        await expect(page.getByText("Mettre à jour votre prénom").first()).toBeVisible();

        // Navigate to Security tab
        await page.goto("/profile?tab=security");
        await expect(page.getByText("Authentification à deux facteurs (TOTP)").first()).toBeVisible();
    });

    test("edition tab: update lastname and firstname", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=edition");

        // Update lastname (first form — .nth(0))
        await page.fill('input[name="lastname"]', "TestNom");
        await page.getByRole("button", { name: "Valider" }).nth(0).click();
        await expect(page.getByText("Nom modifié", { exact: true })).toBeVisible();

        // Update firstname (second form — .nth(1))
        await page.fill('input[name="name"]', "TestPrenom");
        await page.getByRole("button", { name: "Valider" }).nth(1).click();
        await expect(page.getByText("Prénom modifié", { exact: true })).toBeVisible();
    });

    test("edition tab: password validation errors", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=edition");

        // Submit password form without filling (third button — .nth(2))
        await page.getByRole("button", { name: "Valider" }).nth(2).click();

        // Assert validation errors for empty fields
        await expect(page.getByText("Le mot de passe actuel est requis")).toBeVisible();
        await expect(page.getByText("La confirmation est requise")).toBeVisible();

        // Fill with weak password and mismatch
        await page.fill('input[name="newPassword"]', "abc");
        await page.fill('input[name="confirmPassword"]', "xyz");
        await page.locator('input[name="confirmPassword"]').first().blur();

        // Re-submit
        await page.getByRole("button", { name: "Valider" }).nth(2).click();

        // Assert password strength and mismatch errors
        await expect(page.getByText("Au moins 1 majuscule requise")).toBeVisible();
        await expect(page.getByText("Les mots de passe ne correspondent pas")).toBeVisible();
    });

    test("full flow: change password", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Navigate to edition tab
        await page.goto("/profile?tab=edition");

        // Fill password change form
        await page.fill('input[name="currentPassword"]', credentials.password);
        await page.fill('input[name="newPassword"]', newPassword);
        await page.fill('input[name="confirmPassword"]', newPassword);

        // Submit (third button — .nth(2))
        await page.getByRole("button", { name: "Valider" }).nth(2).click();
        await expect(page.getByText("Mot de passe modifié", { exact: true })).toBeVisible();

        // Clear cookies (logout)
        await page.context().clearCookies();

        // Login with new password
        await login(page, credentials.email, newPassword);
        await expect(page).toHaveURL("/");
    });
});
