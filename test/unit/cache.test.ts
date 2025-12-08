import { tag } from "@orpc/cache";
import { describe, expect, it } from "vitest";

describe("Cache tag generation", () => {
    it("generates tag with model only", () => {
        const result = tag("task");
        expect(result).toBe("task");
    });

    it("generates tag with model and operation", () => {
        const result = tag("task", "findMany");
        expect(result).toBe("task-findMany");
    });

    it("generates tag with model, operation and string custom", () => {
        const result = tag("task", "findUnique", "abc123");
        expect(result).toBe("task-findUnique-abc123");
    });

    it("generates tag with model, operation and number custom", () => {
        const result = tag("task", "findUnique", 123);
        expect(result).toBe("task-findUnique-123");
    });

    it("generates tag with model, operation and object custom", () => {
        const result = tag("task", "findMany", { userId: "abc", status: "DONE" });
        expect(result).toContain("task-findMany-");
    });

    it("truncates tag to 255 characters when exceeding 256", () => {
        // Create a very long custom string that will exceed 256 characters
        const longString = "a".repeat(300);
        const result = tag("task", "findMany", longString);

        expect(result.length).toBe(255);
    });
});
