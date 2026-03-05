import { Page, expect, test } from "@playwright/test";
import { register } from "./helpers/auth";
import { generateTOTP } from "./helpers/totp";

const timestamp = Date.now();

const credentials = {
    email: `test-verify2fa-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

let totpSecret = "";

async function enableTwoFactor(page: Page, password: string): Promise<{ secret: string; backupCodes: string[] }> {
    await page.goto("/profile?tab=security");

    await page.getByRole("switch").first().click();
    await page.fill('input[name="password"]', password);
    await page.getByRole("button", { name: "Confirmer" }).click();

    await page.locator("code.select-all").waitFor({ state: "visible" });
    const secret = (await page.locator("code.select-all").textContent()) ?? "";

    const code = await generateTOTP(secret);
    await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);

    await page.locator("div.grid.grid-cols-2").waitFor({ state: "visible" });
    const backupCodes = await page.locator("div.grid.grid-cols-2 code").allTextContents();

    await page.getByRole("button", { name: "Terminer" }).click();
    await page.getByRole("button", { name: "Confirmer" }).click();

    return { secret, backupCodes };
}

async function loginTo2FA(page: Page) {
    await page.goto("/login");
    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/verify-2fa/);
}

test.describe.serial("Verify 2FA", () => {
    test("setup: register user and enable 2FA", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        const result = await enableTwoFactor(page, credentials.password);
        totpSecret = result.secret;
        await page.context().clearCookies();
    });

    test("page accessible when 2FA pending", async ({ page }) => {
        await loginTo2FA(page);

        await expect(page.getByRole("heading", { name: "Vérification en deux étapes" })).toBeVisible();
        await expect(page.getByRole("main").getByText("Confirmez votre identité pour continuer.")).toBeVisible();
        await expect(page.locator('input[autocomplete="one-time-code"]').first()).toBeVisible();

        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);
        await page.waitForURL("/");
    });

    test("redirect to /login when no 2FA pending", async ({ page }) => {
        await page.context().clearCookies();
        await page.goto("/verify-2fa");
        await page.waitForURL(/\/login/);
        await expect(page).toHaveURL(/\/login/);
    });

    test("redirect to / when already authenticated", async ({ page }) => {
        await loginTo2FA(page);
        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);
        await page.waitForURL("/");

        await page.goto("/verify-2fa");
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("cancel 2FA returns to /login", async ({ page }) => {
        await page.context().clearCookies();

        await loginTo2FA(page);
        await page.getByRole("button", { name: "Retour à la connexion" }).click();
        await page.waitForURL(/\/login/);
        await expect(page).toHaveURL(/\/login/);
    });

    test("switch between TOTP and backup code tabs", async ({ page }) => {
        await loginTo2FA(page);

        await expect(page.locator('input[autocomplete="one-time-code"]').first()).toBeVisible();
        await expect(page.getByRole("button", { name: "Utiliser un code de secours" })).toBeVisible();

        await page.getByRole("button", { name: "Utiliser un code de secours" }).click();
        await expect(page.locator('input[name="code"]')).toBeVisible();
        await expect(page.getByRole("button", { name: "Vérifier" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Utiliser l'application d'authentification" })).toBeVisible();

        await page.getByRole("button", { name: "Utiliser l'application d'authentification" }).click();
        await expect(page.locator('input[autocomplete="one-time-code"]').first()).toBeVisible();

        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);
        await page.waitForURL("/");
    });
});
