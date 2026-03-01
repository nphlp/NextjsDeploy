import { expect, test } from "@playwright/test";
import { extractLink } from "./helpers/mailpit";

const timestamp = Date.now();

const credentials = {
    firstname: "Test",
    lastname: "Register",
    email: `test-register-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

test.describe("Register", () => {
    test("page is accessible", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByRole("heading", { name: "S'inscrire" })).toBeVisible();
    });

    test("client validation: empty fields show errors", async ({ page }) => {
        await page.goto("/register");

        // Wait for captcha to auto-pass (button becomes enabled)
        const submitButton = page.getByRole("button", { name: "S'inscrire" }).first();
        await expect(submitButton).toBeEnabled({ timeout: 20_000 });
        await submitButton.click();

        // Assert error messages on required fields
        // firstname + lastname use nameSchema → "Le champ est requis" (appears twice)
        const fieldErrors = page.getByText("Le champ est requis");
        await expect(fieldErrors.first()).toBeVisible();
        expect(await fieldErrors.count()).toBeGreaterThanOrEqual(2);
        // email uses emailSchema → "Le champs est requis"
        await expect(page.getByText("Le champs est requis")).toBeVisible();
        // confirmPassword → "La confirmation est requise"
        await expect(page.getByText("La confirmation est requise")).toBeVisible();
    });

    test("client validation: weak password and mismatch", async ({ page }) => {
        await page.goto("/register");

        await page.fill('input[name="firstname"]', "Jean");
        await page.fill('input[name="lastname"]', "Dupont");
        await page.fill('input[name="email"]', "test@example.com");
        await page.fill('input[name="password"]', "abc");
        await page.fill('input[name="confirmPassword"]', "xyz");

        // Blur to trigger validation
        await page.locator('input[name="confirmPassword"]').first().blur();

        // Wait for captcha and submit to trigger all validations
        await expect(page.getByRole("button", { name: "S'inscrire" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "S'inscrire" }).click();

        // Password fails validation (missing uppercase, number, special char, too short)
        await expect(page.getByText("Au moins 1 majuscule requise")).toBeVisible();
        // Passwords don't match
        await expect(page.getByText("Les mots de passe ne correspondent pas")).toBeVisible();
    });

    test("register success redirects to success page", async ({ page }) => {
        await page.goto("/register");

        // Fill form
        await page.fill('input[name="firstname"]', credentials.firstname);
        await page.fill('input[name="lastname"]', credentials.lastname);
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.fill('input[name="confirmPassword"]', credentials.password);

        // Wait for captcha
        await expect(page.getByRole("button", { name: "S'inscrire" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "S'inscrire" }).click();

        // Assert redirect to success page
        await page.waitForURL(/\/register\/success/);
        await expect(page).toHaveURL(/\/register\/success\?email=/);

        // Assert success page content
        await expect(page.getByRole("heading", { name: "Inscription réussie" })).toBeVisible();
        await expect(page.getByText("Retour à la connexion")).toBeVisible();
    });

    test("email verification via Mailpit auto-logs in", async ({ page }) => {
        const email = `test-verify-${timestamp}@gmail.com`;

        await page.goto("/register");

        // Fill form with unique email
        await page.fill('input[name="firstname"]', credentials.firstname);
        await page.fill('input[name="lastname"]', credentials.lastname);
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', credentials.password);
        await page.fill('input[name="confirmPassword"]', credentials.password);

        // Wait for captcha and submit
        await expect(page.getByRole("button", { name: "S'inscrire" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "S'inscrire" }).click();

        // Wait for redirect to success page
        await page.waitForURL(/\/register\/success/);

        // Extract verification link from Mailpit
        const verificationLink = await extractLink(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);

        // Visit verification link
        await page.goto(verificationLink);

        // Should auto-login and redirect to home
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });
});
