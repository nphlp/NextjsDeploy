#!/usr/bin/env tsx
/**
 * CRON tasks
 *
 * Available commands:
 * - cleanup-activities : Delete expired activity history entries
 *
 * Usage:
 * bun scripts/cron.ts cleanup-activities
 *
 * Scheduled via Dokploy > Schedules tab
 */
import PrismaInstance from "@lib/prisma";

async function cleanupActivities() {
    const result = await PrismaInstance.activityHistory.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });

    console.log(`[cron] cleanup-activities: ${result.count} expired entries deleted`);
}

async function main() {
    const command = process.argv[2];

    switch (command) {
        case "cleanup-activities":
            await cleanupActivities();
            break;
        default:
            console.error(`Unknown command: ${command}`);
            console.error("Available commands: cleanup-activities");
            process.exit(1);
    }

    await PrismaInstance.$disconnect();
}

main().catch((error) => {
    console.error("[cron] error:", error);
    process.exit(1);
});
