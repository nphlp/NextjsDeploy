import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";
import { extractLink } from "./helpers/mailpit";

const timestamp = Date.now();

const credentials = {
    email: `test-change-email-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

const newEmail = `test-change-email-new-${timestamp}@gmail.com`;

test.describe.serial("Change email", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("change email page is visible", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await expect(page.getByText("Changer d'adresse email").first()).toBeVisible();
        await expect(page.getByText(credentials.email).first()).toBeVisible();
    });

    test("client validation: empty field", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await page.getByRole("button", { name: "Changer mon email" }).click();
        await expect(page.getByText("Le champs est requis")).toBeVisible();
    });

    test("client validation: same email as current", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await page.fill('input[name="newEmail"]', credentials.email);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await expect(page.getByText("L'email doit être différent de l'actuel")).toBeVisible();
    });

    test("request change: pending email visible on email page", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await page.fill('input[name="newEmail"]', newEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await page.waitForURL(/\/account\/email\/success/);

        // Pending email visible on /account/email
        await page.goto("/account/email");
        await expect(page.getByText("En attente :").first()).toBeVisible();
        await expect(page.getByText(newEmail).first()).toBeVisible();
    });

    test("cancel: alert dialog confirmation", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await expect(page.getByText("En attente :").first()).toBeVisible({ timeout: 10_000 });

        // Open AlertDialog. Use `.first()` because the card button (visible) and the
        // dialog confirm button (off-screen until open) can both surface the same
        // accessible name during a React 19 transition; the card trigger is always
        // first in DOM order.
        await page.getByLabel("Annuler le changement", { exact: true }).first().click();
        const dialog = page.getByRole("alertdialog");
        await expect(dialog.getByText("Annuler le changement d'email")).toBeVisible();
        await expect(dialog.getByText(newEmail)).toBeVisible();

        // Close without canceling → pending email still visible
        await page.getByRole("button", { name: "Fermer" }).click();
        await expect(page.getByText("En attente :").first()).toBeVisible();

        // Re-open then confirm cancel (dialog button selected by text)
        await page.getByLabel("Annuler le changement", { exact: true }).first().click();
        await dialog.getByText("Annuler le changement", { exact: true }).click();
        await expect(page.getByText("La demande de changement")).toBeVisible();
        await expect(page.getByText("En attente :").first()).not.toBeVisible();
    });

    test("verification link rejected after cancel", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Request a new email change
        const cancelEmail = `test-change-cancel-${timestamp}@gmail.com`;
        await page.goto("/account/email");
        await page.fill('input[name="newEmail"]', cancelEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();
        await page.waitForURL(/\/account\/email\/success/);

        // Extract verification link BEFORE canceling
        const verificationLink = await extractLink(cancelEmail, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);

        // Cancel via AlertDialog
        await page.goto("/account/email");
        await expect(page.getByText("En attente :").first()).toBeVisible({ timeout: 10_000 });
        await page.getByLabel("Annuler le changement", { exact: true }).click();
        await page.getByRole("alertdialog").getByText("Annuler le changement", { exact: true }).click();
        await expect(page.getByText("La demande de changement")).toBeVisible();
        await expect(page.getByText("En attente :").first()).not.toBeVisible(); // Confirms DB committed

        // Verification link should be rejected (single check, DB is committed)
        const response = await page.request.get(verificationLink, { maxRedirects: 0 });
        const isRejected = response.status() === 400 || response.headers()["location"]?.includes("error=");
        expect(isRejected).toBe(true);
    });

    test("full flow: change email and verify", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/account/email");

        await page.fill('input[name="newEmail"]', newEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();

        await page.waitForURL(/\/account\/email\/success/);
        await expect(page.getByRole("heading", { name: "Email de vérification envoyé" })).toBeVisible();

        // Verify via Mailpit link
        const verificationLink = await extractLink(newEmail, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await page.goto(verificationLink);
        await page.waitForURL(/\/account/);

        // Pending email cleared
        await page.goto("/account/email");
        await expect(page.getByText("En attente :").first()).not.toBeVisible();
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
        await page.goto("/account/email");

        await page.fill('input[name="newEmail"]', secondEmail);
        await page.getByRole("button", { name: "Changer mon email" }).click();

        await page.waitForURL(/\/account\/email\/success/);
        await expect(page.getByRole("heading", { name: "Email de vérification envoyé" })).toBeVisible();
    });
});
