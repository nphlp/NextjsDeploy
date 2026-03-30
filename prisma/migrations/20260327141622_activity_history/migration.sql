-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LOGIN', 'EMAIL_CHANGED', 'PASSWORD_CHANGED', 'TOTP_ENABLED', 'TOTP_DISABLED', 'PASSKEY_ADDED', 'PASSKEY_DELETED');

-- CreateTable
CREATE TABLE "ActivityHistory" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "metadata" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityHistory_userId_idx" ON "ActivityHistory"("userId");

-- CreateIndex
CREATE INDEX "ActivityHistory_expiresAt_idx" ON "ActivityHistory"("expiresAt");

-- AddForeignKey
ALTER TABLE "ActivityHistory" ADD CONSTRAINT "ActivityHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
