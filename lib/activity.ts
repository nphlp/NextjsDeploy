import { ActivityType } from "@prisma/client/client";
import PrismaInstance from "./prisma";

export const ACTIVITY_RETENTION_DAYS = 90;

/**
 * Get activity history for a user (most recent first)
 */
export async function getActivities(userId: string) {
    return PrismaInstance.activityHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
}

export type Activity = Awaited<ReturnType<typeof getActivities>>[number];

/**
 * Log a user activity to the ActivityHistory table
 * -> Entries expire after 90 days (cleaned up by CRON)
 */
export async function logActivity(userId: string, type: ActivityType, metadata?: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ACTIVITY_RETENTION_DAYS);

    await PrismaInstance.activityHistory.create({
        data: {
            userId,
            type,
            metadata: metadata ?? null,
            expiresAt,
        },
    });
}
