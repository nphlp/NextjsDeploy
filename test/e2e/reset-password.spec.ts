import { expect, test } from "@playwright/test";
import { extractLink } from "./helpers/mailpit";

const timestamp = Date.now();

const credentials = {
    firstname: "Test",
    lastname: "Reset",
    email: `test-reset-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

const newPassword = "NewSecurePass456!!";

test.describe("Reset Password", () => {
    test("page is accessible", async ({ page }) => {
        await page.goto("/reset-password");
        await expect(page.getByRole("heading", { name: "Mot de passe oublié" })).toBeVisible();
    });

    test("client validation: empty email shows error", async ({ page }) => {
        await page.goto("/reset-password");

        // Wait for captcha to auto-pass (button becomes enabled)
        const submitButton = page.getByRole("button", { name: "Envoyer l'email" }).first();
        await expect(submitButton).toBeEnabled({ timeout: 20_000 });
        await submitButton.click();

        // emailSchema → "Le champs est requis"
        await expect(page.getByText("Le champs est requis")).toBeVisible();
    });

    test("request reset redirects to success page", async ({ page }) => {
        await page.goto("/reset-password");

        // Fill email (user doesn't need to exist — always returns 200)
        await page.fill('input[name="email"]', "no-reply@test.com");

        // Wait for captcha and submit
        const submitButton = page.getByRole("button", { name: "Envoyer l'email" }).first();
        await expect(submitButton).toBeEnabled({ timeout: 20_000 });
        await submitButton.click();

        // Assert redirect to success page (window.location.href = full navigation)
        await page.waitForURL(/\/reset-password\/success/);
        await expect(page).toHaveURL(/\/reset-password\/success\?email=/);

        // Assert success page content
        await expect(page.getByRole("heading", { name: "Email envoyé !" })).toBeVisible();
        await expect(page.getByText("Retour à la connexion")).toBeVisible();
    });

    test("full flow: register → verify → request reset → email → reset password", async ({ page }) => {
        // 1. Register a new user
        await page.goto("/register");
        await page.fill('input[name="firstname"]', credentials.firstname);
        await page.fill('input[name="lastname"]', credentials.lastname);
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.fill('input[name="confirmPassword"]', credentials.password);
        await expect(page.getByRole("button", { name: "S'inscrire" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "S'inscrire" }).click();
        await page.waitForURL(/\/register\/success/);

        // 2. Verify email via Mailpit (requireEmailVerification: true — reset email not sent to unverified accounts)
        const verificationLink = await extractLink(credentials.email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
        await page.goto(verificationLink);
        await page.waitForURL("/");

        // 3. Clear session (auto-login from verification)
        await page.context().clearCookies();

        // 4. Navigate to reset password page
        await page.goto("/reset-password");

        // 5. Request password reset
        // Intercept POST to ensure it completes before window.location.href cancels it
        let resolveApiCall!: () => void;
        const apiCallDone = new Promise<void>((resolve) => {
            resolveApiCall = resolve;
        });
        await page.route("**/api/auth/**", async (route) => {
            if (route.request().method() === "POST") {
                try {
                    const response = await route.fetch();
                    await route.fulfill({ response });
                } catch {
                    // Page may navigate before fulfill — request was still sent
                }
                resolveApiCall();
            } else {
                await route.continue();
            }
        });

        await page.fill('input[name="email"]', credentials.email);
        const submitButton = page.getByRole("button", { name: "Envoyer l'email" }).first();
        await expect(submitButton).toBeEnabled({ timeout: 20_000 });
        await submitButton.click();
        await apiCallDone;
        await page.unroute("**/api/auth/**");
        await page.waitForURL(/\/reset-password\/success/);

        // 6. Extract reset link from Mailpit (link format: /api/auth/reset-password/{token}?callbackURL=...)
        const resetLink = await extractLink(
            credentials.email,
            /http[s]?:\/\/[^\s"<]+\/api\/auth\/reset-password\/[^\s"<]+/,
        );

        // 7. Navigate to reset link
        await page.goto(resetLink);
        await expect(page.getByRole("heading", { name: "Réinitialiser le mot de passe" })).toBeVisible();

        // 8. Fill new password
        await page.fill('input[name="password"]', newPassword);
        await page.fill('input[name="confirmPassword"]', newPassword);

        // 9. Submit → toast + redirect to /login
        await page.click('button[type="submit"]');
        await expect(page.getByText("Mot de passe réinitialisé")).toBeVisible();
        await page.waitForURL("/login");
        await expect(page).toHaveURL("/login");
    });

    test("login with new password", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', newPassword);
        await page.click('button[type="submit"]');

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });
});
