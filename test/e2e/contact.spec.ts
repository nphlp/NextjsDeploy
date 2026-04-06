import { expect, test } from "@playwright/test";
import { register } from "./helpers/auth";
import { getLatestEmail } from "./helpers/mailpit";

const timestamp = Date.now();
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@nansp.dev";

test.describe("Contact page", () => {
    test("page is accessible", async ({ page }) => {
        await page.goto("/contact");

        await expect(page.getByRole("heading", { name: "Nous contacter" })).toBeVisible();
        await expect(page.getByText("Choisir un sujet")).toBeVisible();
    });

    test("subject pre-selected via query params", async ({ page }) => {
        await page.goto("/contact?subject=security");

        // The select should show "Problème de sécurité"
        await expect(page.getByText("Problème de sécurité")).toBeVisible();
    });

    test("client validation: empty fields show errors", async ({ page }) => {
        await page.goto("/contact");

        // Wait for captcha to load
        await expect(page.getByRole("button", { name: "Envoyer" })).toBeEnabled({ timeout: 20_000 });

        // Submit without filling
        await page.getByRole("button", { name: "Envoyer" }).click();

        // Assert validation errors
        await expect(page.getByText("Sélectionnez un sujet")).toBeVisible();
        await expect(page.getByText("Minimum 10 caractères")).toBeVisible();
    });

    test("full flow: submit contact form (not logged in)", async ({ page }) => {
        const senderEmail = `test-contact-${timestamp}@gmail.com`;

        await page.goto("/contact?subject=bug");

        // Fill email (visible because not logged in)
        await page.fill('input[name="email"]', senderEmail);

        // Fill message
        await page.fill('textarea[name="message"]', "Ceci est un message de test pour le formulaire de contact.");

        // Wait for captcha and submit
        await expect(page.getByRole("button", { name: "Envoyer" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "Envoyer" }).click();

        // Assert success toast
        await expect(page.getByText("Message envoyé")).toBeVisible();

        // Check email received in Mailpit (sent to support email)
        const email = await getLatestEmail(SUPPORT_EMAIL);
        expect(email.Subject).toContain("[Contact]");
        expect(email.Subject).toContain("Signaler un bug");
    });

    test("full flow: submit contact form (logged in, no email field)", async ({ page }) => {
        const userEmail = `test-contact-user-${timestamp}@gmail.com`;
        await register(page, userEmail, "SecurePass123!!");

        await page.goto("/contact?subject=improvement");

        // Email field should NOT be visible (logged in)
        await expect(page.locator('input[name="email"]')).not.toBeVisible();

        // Fill message
        await page.fill('textarea[name="message"]', "Suggestion : ajouter un mode sombre automatique.");

        // Wait for captcha and submit
        await expect(page.getByRole("button", { name: "Envoyer" })).toBeEnabled({ timeout: 20_000 });
        await page.getByRole("button", { name: "Envoyer" }).click();

        // Assert success toast
        await expect(page.getByText("Message envoyé")).toBeVisible();

        // Check email received in Mailpit
        const email = await getLatestEmail(SUPPORT_EMAIL);
        expect(email.Subject).toContain("[Contact]");
        expect(email.Subject).toContain("amélioration");
    });

    test("footer link navigates to contact page", async ({ page }) => {
        await page.goto("/login");

        // Click footer link
        await page.getByRole("link", { name: "Nous contacter" }).click();
        await page.waitForURL("/contact");

        await expect(page.getByRole("heading", { name: "Nous contacter" })).toBeVisible();
    });
});
