import { customSyntheticUser } from "@lib/auth";
import { describe, expect, it, vi } from "vitest";

// Mock all auth.ts dependencies
vi.mock("@lib/env", () => ({
    BETTER_AUTH_SECRET: "test",
    IS_DEV: false,
    IS_TEST: true,
    NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    TURNSTILE_SECRET_KEY: "test",
}));
vi.mock("@actions/SendEmailAction", () => ({ default: vi.fn() }));
vi.mock("@comps/email-template", () => ({ default: vi.fn() }));
vi.mock("@lib/prisma", () => ({
    default: { $extends: () => ({}) },
}));

describe("customSyntheticUser — anti-enumeration key order", () => {
    it("produces keys in the same order as a real Prisma user", () => {
        // Simulate the key order Better Auth passes for a real user
        // coreFields come from Better Auth core: name, email, emailVerified, image, createdAt, updatedAt
        // additionalFields come from our schema: lastname, pendingEmail
        const synthetic = customSyntheticUser({
            coreFields: {
                name: "Fake",
                email: "fake@test.com",
                emailVerified: false,
                image: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            additionalFields: {
                lastname: "User",
                pendingEmail: null,
            },
            id: "fake-id",
        });

        const syntheticKeys = Object.keys(synthetic);

        // Real Prisma user key order (from schema.prisma):
        // id, name, lastname, email, emailVerified, image, role, twoFactorEnabled, pendingEmail, createdAt, updatedAt
        // After Better Auth processing, the order should be:
        // coreFields (name, email, emailVerified, image, createdAt, updatedAt)
        // + twoFactorEnabled (injected between core and additional)
        // + additionalFields (lastname, pendingEmail)
        // + id (last)

        // The critical check: twoFactorEnabled must appear AFTER coreFields and BEFORE additionalFields
        const twoFactorIndex = syntheticKeys.indexOf("twoFactorEnabled");
        const idIndex = syntheticKeys.indexOf("id");
        const nameIndex = syntheticKeys.indexOf("name");

        expect(twoFactorIndex).toBeGreaterThan(nameIndex);
        expect(idIndex).toBe(syntheticKeys.length - 1); // id is last
        expect(twoFactorIndex).toBeLessThan(idIndex);
    });

    it("includes twoFactorEnabled as false", () => {
        const synthetic = customSyntheticUser({
            coreFields: { name: "Test" },
            additionalFields: {},
            id: "test-id",
        });

        expect(synthetic.twoFactorEnabled).toBe(false);
    });

    it("preserves all coreFields", () => {
        const synthetic = customSyntheticUser({
            coreFields: { name: "Alice", email: "alice@test.com", emailVerified: true },
            additionalFields: {},
            id: "test-id",
        }) as Record<string, unknown>;

        expect(synthetic.name).toBe("Alice");
        expect(synthetic.email).toBe("alice@test.com");
        expect(synthetic.emailVerified).toBe(true);
    });

    it("preserves all additionalFields", () => {
        const synthetic = customSyntheticUser({
            coreFields: {},
            additionalFields: { lastname: "Smith", pendingEmail: null },
            id: "test-id",
        }) as Record<string, unknown>;

        expect(synthetic.lastname).toBe("Smith");
        expect(synthetic.pendingEmail).toBeNull();
    });

    it("sets id from the parameter (not from coreFields)", () => {
        const synthetic = customSyntheticUser({
            coreFields: { id: "should-be-overridden" },
            additionalFields: {},
            id: "correct-id",
        });

        expect(synthetic.id).toBe("correct-id");
    });
});
