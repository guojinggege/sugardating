-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "creatorSlug" TEXT NOT NULL,
    "creatorType" TEXT NOT NULL DEFAULT 'sugargirl',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Follow_userId_createdAt_idx" ON "Follow"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Follow_creatorSlug_idx" ON "Follow"("creatorSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_userId_creatorSlug_key" ON "Follow"("userId", "creatorSlug");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
