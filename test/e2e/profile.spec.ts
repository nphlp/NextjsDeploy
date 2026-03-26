import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";
import { getLatestEmailBySubject } from "./helpers/mailpit";

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

        // Check security notification email
        const notif = await getLatestEmailBySubject(credentials.email, "mot de passe");
        expect(notif.Subject).toContain("mot de passe");

        // Clear cookies (logout)
        await page.context().clearCookies();

        // Login with new password
        await login(page, credentials.email, newPassword);
        await expect(page).toHaveURL("/");
    });

    test("wrong current password shows error", async ({ page }) => {
        await login(page, credentials.email, newPassword);
        await page.goto("/profile?tab=edition");

        // Fill with wrong current password
        await page.fill('input[name="currentPassword"]', "WrongPassword123!!");
        await page.fill('input[name="newPassword"]', "AnotherPass789!!");
        await page.fill('input[name="confirmPassword"]', "AnotherPass789!!");

        // Submit (third button — .nth(2))
        await page.getByRole("button", { name: "Valider" }).nth(2).click();
        await expect(page.getByText("Échec")).toBeVisible();
    });

    test("session revoke single", async ({ page }) => {
        await login(page, credentials.email, newPassword);

        // Previous tests created multiple sessions — go to profile to see them
        await page.goto("/profile");

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
        await page.goto("/profile");

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
