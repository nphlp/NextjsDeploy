import { expect, test } from "@playwright/test";
import { register } from "./helpers/auth";

const timestamp = Date.now();
const credentials = {
    email: `test-login-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

test.describe.serial("Login", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("page is accessible", async ({ page }) => {
        await page.goto("/login");
        await expect(page.locator("h1")).toHaveText("Connexion");
    });

    test("successful login", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');

        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });

    test("failed login with wrong password", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', "WrongPassword123!");
        await page.click('button[type="submit"]');

        await expect(page.getByText("Échec de la connexion")).toBeVisible();
    });

    test("protected guard redirects unauthenticated users", async ({ page }) => {
        await page.goto("/fruit/create");
        await page.waitForURL(/\/login\?redirect=/);
        await expect(page).toHaveURL("/login?redirect=%2Ffruit%2Fcreate");
    });

    test("login with redirect query param", async ({ page }) => {
        await page.goto("/login?redirect=/fruit/create");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');

        await page.waitForURL("/fruit/create");
        await expect(page).toHaveURL("/fruit/create");
    });

    test("guest-only guard redirects authenticated users", async ({ page }) => {
        // Login
        await page.goto("/login");
        await page.fill('input[name="email"]', credentials.email);
        await page.fill('input[name="password"]', credentials.password);
        await page.click('button[type="submit"]');
        await page.waitForURL("/");

        // Navigate to guest-only route — should redirect back to /
        await page.goto("/login");
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");
    });
});
