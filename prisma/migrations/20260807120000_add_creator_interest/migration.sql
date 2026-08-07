-- CreateTable
CREATE TABLE "CreatorInterest" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "telephone" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "locale" TEXT,
    "source" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreatorInterest_createdAt_idx" ON "CreatorInterest"("createdAt");

-- CreateIndex
CREATE INDEX "CreatorInterest_status_createdAt_idx" ON "CreatorInterest"("status", "createdAt");
