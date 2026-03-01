import { expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";

const timestamp = Date.now();
const credentials = {
    email: `test-logout-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

test.describe.serial("Logout", () => {
    test("setup: register user", async ({ page }) => {
        await register(page, credentials.email, credentials.password);
        await page.context().clearCookies();
    });

    test("logout redirects to home with no session", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Open user menu and click "Déconnexion"
        const userIcon = page.locator(".lucide-user-round").first();
        await expect(userIcon).toBeVisible();
        await userIcon.click();
        await page.getByText("Déconnexion").click();

        // Should redirect to / (hard navigation via window.location.href)
        await page.waitForURL("/");
        await expect(page).toHaveURL("/");

        // Verify no session — menu should show "Connexion" instead of "Déconnexion"
        await page.locator(".lucide-user-round").first().click();
        await expect(page.getByText("Connexion")).toBeVisible();
    });

    test("after logout, protected route redirects to login", async ({ page }) => {
        await login(page, credentials.email, credentials.password);

        // Listen for page reload BEFORE clicking — window.location.href = "/" triggers hard reload
        const reloadDone = page.waitForEvent("load");
        await page.locator(".lucide-user-round").first().click();
        await page.getByText("Déconnexion").click();
        await reloadDone;

        // Navigate to protected route — should redirect to login
        await page.goto("/profile");
        await page.waitForURL(/\/login\?redirect=/);
        await expect(page).toHaveURL("/login?redirect=%2Fprofile");
    });
});
