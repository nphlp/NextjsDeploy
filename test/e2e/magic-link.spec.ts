import { expect, test } from "@playwright/test";
import { register } from "./helpers/auth";
import { deleteAllEmails, extractLink, getLatestEmail } from "./helpers/mailpit";

const timestamp = Date.now();
const credentials = {
    email: `test-magic-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

test.describe("Magic Link", () => {
    test("send magic link → redirect to success page", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();

        await page.goto("/login");
        await page.getByRole("button", { name: "Magic Link" }).click();
        await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Connexion par email");

        await page.fill('input[name="email"]', credentials.email);
        await page.getByRole("button", { name: "Envoyer le lien" }).click();

        await page.waitForURL(/\/login\/success/);
        await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Lien de connexion envoyé !");
    });

    test("click email link → auto-login → redirect /", async ({ page }) => {
        const email = `test-magic-link-${timestamp}@gmail.com`;

        await register(page, email, credentials.password);
        await page.context().clearCookies();

        await page.goto("/login");
        await page.getByRole("button", { name: "Magic Link" }).click();
        await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Connexion par email");

        await page.fill('input[name="email"]', email);
        await page.getByRole("button", { name: "Envoyer le lien" }).click();
        await page.waitForURL(/\/login\/success/);

        const magicLink = await extractLink(email, /http[s]?:\/\/[^\s"<]+magic-link[^\s"<]*/);
        await page.goto(magicLink);

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("invalid magic link → error", async ({ page }) => {
        await page.goto("/api/auth/magic-link/verify?token=invalid-token-123");

        await page.waitForURL(/[?&]error=/);
        expect(page.url()).toContain("error=");
    });

    test("magic link to non-existing user sends register email", async ({ page }) => {
        await deleteAllEmails();

        const nonExistingEmail = `test-magic-nouser-${timestamp}@gmail.com`;

        // Navigate to magic link page
        await page.goto("/login");
        await page.getByRole("button", { name: "Magic Link" }).click();
        await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText("Connexion par email");

        // Fill non-existing email and submit
        await page.fill('input[name="email"]', nonExistingEmail);
        await page.getByRole("button", { name: "Envoyer le lien" }).click();

        // Assert redirect to success page (anti-enum: same page as existing user)
        await page.waitForURL(/\/login\/success/);

        // Fetch email from Mailpit
        const email = await getLatestEmail(nonExistingEmail);

        // Assert email contains register link (not a magic link)
        expect(email.HTML).toContain("/register");
        expect(email.HTML).not.toContain("magic-link/verify");
    });
});
