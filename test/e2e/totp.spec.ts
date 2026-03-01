import { Page, expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";
import { generateTOTP } from "./helpers/totp";

const timestamp = Date.now();
const credentials = {
    email: `test-totp-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

let totpSecret = "";

async function loginToVerify2fa(page: Page) {
    await page.goto("/login");
    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/verify-2fa/);
}

test.describe.serial("TOTP", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("enable 2FA from profile", async ({ page }) => {
        await login(page, credentials.email, credentials.password);
        await page.goto("/profile?tab=security");

        await expect(page.getByRole("tabpanel").getByText("Inactif")).toBeVisible();
        await page.getByRole("switch").first().click();

        await page.fill('input[name="password"]', credentials.password);
        await page.getByRole("button", { name: "Confirmer" }).click();

        await expect(page.getByText("Étape 1")).toBeVisible();
        const secret = await page.locator("code.select-all").textContent();
        expect(secret).toBeTruthy();
        totpSecret = secret!.trim();

        await expect(page.getByText("Étape 2")).toBeVisible();
        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);

        await expect(page.locator("div.grid.grid-cols-2 code").first()).toBeVisible({ timeout: 10_000 });
        const codes = await page.locator("div.grid.grid-cols-2 code").allTextContents();
        expect(codes.length).toBeGreaterThanOrEqual(6);

        await page.getByRole("button", { name: "Terminer" }).click();
        await page.getByRole("button", { name: "Confirmer" }).click();

        await expect(page.getByRole("tabpanel").getByText("Activé")).toBeVisible();
    });

    test("login with TOTP → /verify-2fa → code → redirect /", async ({ page }) => {
        await page.context().clearCookies();
        await loginToVerify2fa(page);

        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("wrong TOTP → error", async ({ page }) => {
        await page.context().clearCookies();
        await loginToVerify2fa(page);

        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially("000000");

        await expect(page.getByText("Code invalide")).toBeVisible();
    });

    test("trust device → next login skips 2FA", async ({ page }) => {
        await page.context().clearCookies();
        await loginToVerify2fa(page);

        await page.getByLabel("Faire confiance à cet appareil (30 jours)").check();

        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");

        // Logout via UI (preserves trust device cookie)
        // Listen for page reload BEFORE clicking — window.location.href = "/" triggers hard reload
        const reloadDone = page.waitForEvent("load");
        await page.locator(".lucide-user-round").first().click();
        await page.getByText("Déconnexion").click();
        await reloadDone;

        // Login again — should skip /verify-2fa
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("disable 2FA → next login skips /verify-2fa", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');

        // Handle potential 2FA redirect
        try {
            await page.waitForURL(/\/verify-2fa/, { timeout: 3000 });
            const code = await generateTOTP(totpSecret);
            await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);
            await page.waitForURL("/");
        } catch {
            await page.waitForURL("/");
        }

        await page.goto("/profile?tab=security");
        await expect(page.getByRole("tabpanel").getByText("Activé")).toBeVisible();
        await page.getByRole("switch").first().click();

        await page.fill('input[name="password"]', credentials.password);
        await page.getByRole("button", { name: "Désactiver" }).click();

        await expect(page.getByRole("tabpanel").getByText("Inactif")).toBeVisible();

        await page.context().clearCookies();

        await login(page, credentials.email, credentials.password);
        await expect(page).toHaveURL("/");
    });
});
