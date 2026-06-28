-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Work_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Work" ("createdAt", "creatorId", "id", "title", "visibility") SELECT "createdAt", "creatorId", "id", "title", "visibility" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
