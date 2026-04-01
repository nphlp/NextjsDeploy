import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";
import { extractLink } from "./helpers/mailpit";

const timestamp = Date.now();

const credentials = {
    email: `test-change-email-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

const newEmail = `test-change-email-new-${timestamp}@gmail.com`;

/** Scope assertions to the active profile tab panel */
const profilePanel = (page: import("@playwright/test").Page) => page.getByLabel("Profil");

test.describe.serial("Change email", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("security tab: change email section is visible", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        const securityPanel = page.getByLabel("Sécurité");
        await expect(securityPanel.getByText("Changer d'adresse email")).toBeVisible();
        await expect(securityPanel.getByText(credentials.email)).toBeVisible();
    });

    test("client validation: empty field", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        await page.getByRole("button", { name: "Changer mon email" }).click();
        await expect(page.getByText("Le champs est requis")).toBeVisible();
    });

    test("client validation: same email as current", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        await page.fill('input[name="newEmail"]', credentials.email);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await expect(page.getByText("L'email doit être différent de l'actuel")).toBeVisible();
    });

    test("request change: pending email visible in profile", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        await page.fill('input[name="newEmail"]', newEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await page.waitForURL(/\/profile\/change-email\/success/);

        // Pending email visible in profile tab
        await page.goto("/profile");
        const panel = profilePanel(page);
        await expect(panel.getByText("En attente")).toBeVisible();
        await expect(panel.getByText(newEmail).first()).toBeVisible();
    });

    test("cancel: alert dialog confirmation", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile");

        const panel = profilePanel(page);
        await expect(panel.getByText("En attente")).toBeVisible({ timeout: 10_000 });

        // Open AlertDialog
        await panel.getByLabel("Annuler le changement", { exact: true }).click();
        const dialog = page.getByRole("alertdialog");
        await expect(dialog.getByText("Annuler le changement d'email")).toBeVisible();
        await expect(dialog.getByText(newEmail)).toBeVisible();

        // Close without canceling → pending email still visible
        await page.getByRole("button", { name: "Fermer" }).click();
        await expect(panel.getByText("En attente")).toBeVisible();

        // Confirm cancel → pending email removed
        await panel.getByLabel("Annuler le changement", { exact: true }).click();
        await page.getByRole("button", { name: "Annuler le changement" }).click();
        await expect(page.getByText("La demande de changement")).toBeVisible();
        await expect(panel.getByText("En attente")).not.toBeVisible();
    });

    test("verification link rejected after cancel", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Request a new email change
        const cancelEmail = `test-change-cancel-${timestamp}@gmail.com`;
        await page.goto("/profile?tab=security");
        await page.fill('input[name="newEmail"]', cancelEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await page.waitForURL(/\/profile\/change-email\/success/);

        // Extract verification link BEFORE canceling
        const verificationLink = await extractLink(cancelEmail, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);

        // Cancel via AlertDialog
        await page.goto("/profile");
        const panel = profilePanel(page);
        await expect(panel.getByText("En attente")).toBeVisible({ timeout: 10_000 });
        await panel.getByLabel("Annuler le changement", { exact: true }).click();
        await page.getByRole("button", { name: "Annuler le changement" }).click();
        await expect(page.getByText("La demande de changement")).toBeVisible();
        await expect(panel.getByText("En attente")).not.toBeVisible(); // Confirms DB committed

        // Verification link should be rejected (single check, DB is committed)
        const response = await page.request.get(verificationLink, { maxRedirects: 0 });
        const isRejected = response.status() === 400 || response.headers()["location"]?.includes("error=");
        expect(isRejected).toBe(true);
    });

    test("full flow: change email and verify", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        await page.fill('input[name="newEmail"]', newEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();

        await page.waitForURL(/\/profile\/change-email\/success/);
        await expect(page.getByRole("heading", { name: "Email de vérification envoyé" })).toBeVisible();

        // Verify via Mailpit link
        const verificationLink = await extractLink(newEmail, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await page.goto(verificationLink);
        await page.waitForURL(/\/profile/);

        // Pending email cleared
        await page.goto("/profile");
        await expect(profilePanel(page).getByText("En attente")).not.toBeVisible();
    });

    test("login with new email works", async ({ page }) => {
        await page.context().clearCookies();
        await login(page, newEmail, credentials.password);
        await expect(page).toHaveURL("/");
    });

    test("login with old email fails", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');
        await expect(page.getByText("Échec")).toBeVisible();
    });

    test("anti-enum: change to existing email shows success page (no leak)", async ({ page }) => {
        const secondEmail = `test-change-email-second-${timestamp}@gmail.com`;
        await register(page, secondEmail, credentials.password);
        await page.context().clearCookies();

        await login(page, newEmail, credentials.password);
        await page.goto("/profile?tab=security");

        await page.fill('input[name="newEmail"]', secondEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();

        await page.waitForURL(/\/profile\/change-email\/success/);
        await expect(page.getByRole("heading", { name: "Email de vérification envoyé" })).toBeVisible();
    });
});
