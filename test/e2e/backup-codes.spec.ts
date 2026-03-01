import { expect, test } from "@playwright/test";
import { register } from "./helpers/auth";
import { generateTOTP } from "./helpers/totp";

const timestamp = Date.now();
const credentials = {
    email: `test-backup-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

let totpSecret = "";
let backupCodes: string[] = [];

test.describe.serial("Backup Codes", () => {
    test("view backup codes during 2FA setup", async ({ page }) => {
        await register(page, credentials.email, credentials.password);

        await page.goto("/profile?tab=security");

        // Enable 2FA — wait for section to load then click switch
        const totpSwitch = page.getByRole("switch");
        await expect(totpSwitch).toBeVisible();
        await totpSwitch.click();

        // PasswordForm — fill password and confirm
        await page.fill('input[name="password"]', credentials.password);
        await page.getByRole("button", { name: "Confirmer" }).click();

        // Step 1 — QR code with TOTP secret
        await expect(page.locator("code.select-all")).toBeVisible();
        totpSecret = (await page.locator("code.select-all").textContent()) ?? "";
        expect(totpSecret).toBeTruthy();

        // Step 2 — Enter TOTP code
        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);

        // Backup codes grid appears
        const codesGrid = page.locator("div.grid.grid-cols-2 code");
        await expect(codesGrid.first()).toBeVisible();
        backupCodes = await codesGrid.allTextContents();
        expect(backupCodes.length).toBeGreaterThanOrEqual(6);

        // Close — "Terminer" → AlertDialog "Confirmer"
        await page.getByRole("button", { name: "Terminer" }).click();
        await page.getByRole("alertdialog").getByRole("button", { name: "Confirmer" }).click();
    });

    test("login with backup code redirects to /", async ({ page }) => {
        await page.context().clearCookies();

        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');

        await page.waitForURL(/\/verify-2fa/);
        await expect(page.getByRole("heading", { name: "Vérification en deux étapes" })).toBeVisible();

        // Switch to backup code tab
        await page.getByText("Utiliser un code de secours").click();

        // Fill backup code and submit
        await page.fill('input[name="code"]', backupCodes[0]);
        await page.getByRole("button", { name: "Vérifier" }).click();

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("used backup code cannot be reused", async ({ page }) => {
        await page.context().clearCookies();

        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');

        await page.waitForURL(/\/verify-2fa/);

        // Switch to backup code tab
        await page.getByText("Utiliser un code de secours").click();

        // Reuse the same backup code
        await page.fill('input[name="code"]', backupCodes[0]);
        await page.getByRole("button", { name: "Vérifier" }).click();

        await expect(page.getByText("Code invalide")).toBeVisible();
    });

    test("regenerate backup codes invalidates old codes", async ({ page }) => {
        // Login and complete 2FA with TOTP
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/verify-2fa/);

        const code = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(code);
        await page.waitForURL("/");

        // Go to profile security tab
        await page.goto("/profile?tab=security");

        // Regenerate backup codes
        await page.getByRole("button", { name: "Régénérer mes codes de secours" }).click();
        await page.fill('input[name="password"]', credentials.password);
        await page.getByRole("button", { name: "Régénérer" }).click();

        // Extract new backup codes
        const codesGrid = page.locator("div.grid.grid-cols-2 code");
        await expect(codesGrid.first()).toBeVisible();
        const newBackupCodes = await codesGrid.allTextContents();
        expect(newBackupCodes.length).toBeGreaterThanOrEqual(6);

        // Close — "Terminé" → AlertDialog "Confirmer"
        await page.getByRole("button", { name: "Terminé" }).click();
        await page.getByRole("alertdialog").getByRole("button", { name: "Confirmer" }).click();

        // Clear session and login again
        await page.context().clearCookies();

        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/\/verify-2fa/);

        // Try old backup code — should fail
        await page.getByText("Utiliser un code de secours").click();
        await page.fill('input[name="code"]', backupCodes[1]);
        await page.getByRole("button", { name: "Vérifier" }).click();
        await expect(page.getByText("Code invalide")).toBeVisible();

        // Use TOTP to verify and complete login
        await page.getByText("Utiliser l'application d'authentification").click();
        const totpCode = await generateTOTP(totpSecret);
        await page.locator('input[autocomplete="one-time-code"]').first().pressSequentially(totpCode);
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });
});
