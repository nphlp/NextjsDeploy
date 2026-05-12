import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";
import { getLatestEmailBySubject } from "./helpers/mailpit";

const timestamp = Date.now();
const credentials = {
    email: `test-account-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

const newPassword = "NewSecurePass456!!";

test.describe.serial("Account", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("auth guard redirects to login", async ({ page }) => {
        await page.goto("/account");
        await page.waitForURL(/\/login\?redirect=/);
        await expect(page).toHaveURL("/login?redirect=%2Faccount");
    });

    test("hub page shows user info and sub-page links", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Hub page
        await page.goto("/account");
        await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
        await expect(page.getByText(credentials.email)).toBeVisible();

        // Contact sub-page
        await page.goto("/account/contact");
        await expect(page.getByText("Mettre à jour votre prénom").first()).toBeVisible();

        // TOTP sub-page
        await page.goto("/account/totp");
        await expect(page.getByText("Authentification à deux facteurs (TOTP)").first()).toBeVisible();
    });

    test("contact sub-page: update lastname and firstname", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/contact");

        // Update lastname (first form — .nth(0))
        await page.fill('input[name="lastname"]', "TestNom");
        await page.getByRole("button", { name: "Valider" }).nth(0).click();
        await expect(page.getByText("Nom modifié", { exact: true })).toBeVisible();

        // Update firstname (second form — .nth(1))
        await page.fill('input[name="name"]', "TestPrenom");
        await page.getByRole("button", { name: "Valider" }).nth(1).click();
        await expect(page.getByText("Prénom modifié", { exact: true })).toBeVisible();
    });

    test("password sub-page: validation errors", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/password");

        // Submit password form without filling
        await page.getByRole("button", { name: "Valider" }).click();

        // Assert validation errors for empty fields
        await expect(page.getByText("Le mot de passe actuel est requis")).toBeVisible();
        await expect(page.getByText("La confirmation est requise")).toBeVisible();

        // Fill with weak password and mismatch
        await page.fill('input[name="newPassword"]', "abc");
        await page.fill('input[name="confirmPassword"]', "xyz");
        await page.locator('input[name="confirmPassword"]').first().blur();

        // Re-submit
        await page.getByRole("button", { name: "Valider" }).click();

        // Assert password strength and mismatch errors
        await expect(page.getByText("Au moins 1 majuscule requise")).toBeVisible();
        await expect(page.getByText("Les mots de passe ne correspondent pas")).toBeVisible();
    });

    test("password sub-page: full flow change password", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/password");

        // Fill password change form
        await page.fill('input[name="currentPassword"]', credentials.password);
        await page.fill('input[name="newPassword"]', newPassword);
        await page.fill('input[name="confirmPassword"]', newPassword);

        // Submit
        await page.getByRole("button", { name: "Valider" }).click();
        await expect(page.getByText("Mot de passe modifié", { exact: true })).toBeVisible();

        // Check security notification email
        const notif = await getLatestEmailBySubject(credentials.email, "mot de passe");
        expect(notif.Subject).toContain("mot de passe");

        // Clear cookies (logout)
        await page.context().clearCookies();

        // Login with new password
        await login(page, credentials.email, newPassword);
        await expect(page).toHaveURL("/");
    });

    test("password sub-page: wrong current password shows error", async ({ page }) => {
        await login(page, credentials.email, newPassword);
        await page.goto("/account/password");

        // Fill with wrong current password
        await page.fill('input[name="currentPassword"]', "WrongPassword123!!");
        await page.fill('input[name="newPassword"]', "AnotherPass789!!");
        await page.fill('input[name="confirmPassword"]', "AnotherPass789!!");

        // Submit
        await page.getByRole("button", { name: "Valider" }).click();
        await expect(page.getByText("Échec")).toBeVisible();
    });

    test("session revoke single", async ({ page }) => {
        await login(page, credentials.email, newPassword);

        // Previous tests created multiple sessions — go to hub to see them
        await page.goto("/account");

        // Assert at least 1 other session visible
        const sessionItems = page.getByRole("button", { name: /Déconnecter la session/ });
        await expect(sessionItems.first()).toBeVisible();
        const countBefore = await sessionItems.count();

        // Click first session revoke button → AlertDialog
        await sessionItems.first().click();
        await expect(page.getByText("Souhaitez-vous déconnecter cette session ?")).toBeVisible();

        // Confirm disconnect (exact: true to avoid matching "Déconnecter la session du...")
        await page.getByRole("button", { name: "Déconnecter", exact: true }).click();

        // Assert session count decreased by 1
        await expect(sessionItems).toHaveCount(countBefore - 1);
    });

    test("session revoke all", async ({ page }) => {
        await login(page, credentials.email, newPassword);

        // Previous tests still have leftover sessions
        await page.goto("/account");

        // Assert "Révoquer les sessions" button is visible
        await expect(page.getByRole("button", { name: "Révoquer les sessions" })).toBeVisible();

        // Click → AlertDialog "Déconnexion globale"
        await page.getByRole("button", { name: "Révoquer les sessions" }).click();
        await expect(page.getByText("Déconnexion globale")).toBeVisible();

        // Confirm disconnect (exact: true to avoid matching "Déconnecter la session du...")
        await page.getByRole("button", { name: "Déconnecter", exact: true }).click();
        await expect(page.getByText("Aucune autre session n'est active.")).toBeVisible();
    });
});
