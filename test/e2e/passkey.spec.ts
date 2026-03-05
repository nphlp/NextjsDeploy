import { type CDPSession, type Page, expect, test } from "@playwright/test";
import { login, register } from "./helpers/auth";

const timestamp = Date.now();
const credentials = {
    email: `test-passkey-${timestamp}@gmail.com`,
    password: "SecurePass123!!",
};

let page: Page;
let cdpClient: CDPSession;
let authenticatorId: string;

async function addPasskey() {
    await page.goto("/profile?tab=security");
    await page.getByRole("button", { name: "Ajouter une clé d'accès" }).click();
    await expect(page.getByRole("heading", { name: "Ajouter une clé d'accès" })).toBeVisible();
    await page.getByRole("button", { name: "Ajouter la clé" }).click();

    // WebAuthn ceremony can intermittently fail — retry once
    const success = page.getByText("Clé d'accès ajoutée");
    const error = page.getByText("Impossible d'ajouter");
    await expect(success.or(error)).toBeVisible();

    if (await error.isVisible()) {
        await page.waitForTimeout(500);
        await page.goto("/profile?tab=security");
        await page.getByRole("button", { name: "Ajouter une clé d'accès" }).click();
        await expect(page.getByRole("heading", { name: "Ajouter une clé d'accès" })).toBeVisible();
        await page.getByRole("button", { name: "Ajouter la clé" }).click();
        await expect(success).toBeVisible();
    }
}

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    cdpClient = await page.context().newCDPSession(page);
    await cdpClient.send("WebAuthn.enable");
    const result = await cdpClient.send("WebAuthn.addVirtualAuthenticator", {
        options: {
            protocol: "ctap2",
            transport: "internal",
            hasResidentKey: true,
            hasUserVerification: true,
            isUserVerified: true,
            automaticPresenceSimulation: true,
        },
    });
    authenticatorId = result.authenticatorId;
});

test.afterAll(async () => {
    await page.close();
});

test("setup: register user", async () => {
    await register(page, credentials.email, credentials.password);
    await page.context().clearCookies();
});

test("add passkey from profile → list updated", async () => {
    await login(page, credentials.email, credentials.password);
    await addPasskey();

    const passkeyItems = page.getByRole("button", { name: "Supprimer la clé d'accès" });
    await expect(passkeyItems.first()).toBeVisible();
    expect(await passkeyItems.count()).toBeGreaterThanOrEqual(1);
});

test("login with passkey → redirect /", async () => {
    await page.context().clearCookies();

    await page.goto("/login");
    await page.getByRole("button", { name: "Passkey" }).click();

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
});

test("delete passkey from profile → list updated", async () => {
    await page.goto("/profile?tab=security");

    const deleteButtons = page.getByRole("button", { name: "Supprimer la clé d'accès" });
    await expect(deleteButtons.first()).toBeVisible();
    const initialCount = await deleteButtons.count();

    await deleteButtons.last().click();
    await expect(page.getByRole("heading", { name: "Supprimer la clé d'accès" })).toBeVisible();
    await page.getByRole("button", { name: "Supprimer", exact: true }).click();

    await expect(page.getByText("Clé d'accès supprimée")).toBeVisible();
    await expect(deleteButtons).toHaveCount(initialCount - 1);
});

test("login with deleted passkey → error", async () => {
    await page.context().clearCookies();

    await page.goto("/login");
    await page.getByRole("button", { name: "Passkey" }).click();

    // All passkeys deleted: server rejects the credential → error toast
    await expect(page.getByText("Échec de la connexion").or(page.getByText("Erreur"))).toBeVisible({
        timeout: 15_000,
    });
});

test("cancel passkey prompt → error", async () => {
    // Replace VA with one that rejects user verification
    await cdpClient.send("WebAuthn.removeVirtualAuthenticator", { authenticatorId });
    const result = await cdpClient.send("WebAuthn.addVirtualAuthenticator", {
        options: {
            protocol: "ctap2",
            transport: "internal",
            hasResidentKey: true,
            hasUserVerification: true,
            isUserVerified: false,
            automaticPresenceSimulation: true,
        },
    });
    authenticatorId = result.authenticatorId;

    await page.goto("/login");
    await page.getByRole("button", { name: "Passkey" }).click();
    await expect(page.getByText("Échec de la connexion").or(page.getByText("Erreur"))).toBeVisible({
        timeout: 10_000,
    });
});
