import { type Page, expect } from "@playwright/test";
import { extractLink } from "./mailpit";

/** Login with email and password, waits for redirect to `/` */
export async function login(page: Page, email: string, password: string) {
    await page.goto("/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
}

/** Full register flow: register + verify email via Mailpit → auto-login → redirect `/` */
export async function register(page: Page, email: string, password: string) {
    const firstname = "Test";
    const lastname = "Register";

    await page.goto("/register");
    await page.fill('input[name="firstname"]', firstname);
    await page.fill('input[name="lastname"]', lastname);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await expect(page.getByRole("button", { name: "S'inscrire" })).toBeEnabled({ timeout: 20_000 });
    await page.getByRole("button", { name: "S'inscrire" }).click();
    await page.waitForURL(/\/register\/success/);

    // Verify email via Mailpit (auto-login)
    const verificationLink = await extractLink(email, /http[s]?:\/\/[^\s"<]+verify[^\s"<]*/);
    await page.goto(verificationLink);
    await page.waitForURL("/");
}
