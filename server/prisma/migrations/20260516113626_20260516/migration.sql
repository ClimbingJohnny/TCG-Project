/*
  Warnings:

  - You are about to alter the column `kind` on the `Card` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `admin` on the `User` table. All the data in the column will be lost.
  - Added the required column `pack` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raceid` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "kind" INTEGER NOT NULL,
    "flavorText" TEXT,
    "effect" JSONB,
    "raceid" INTEGER NOT NULL,
    "regulation" INTEGER NOT NULL DEFAULT 0,
    "pack" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Card_raceid_fkey" FOREIGN KEY ("raceid") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("flavorText", "id", "kind", "name", "regulation") SELECT "flavorText", "id", "kind", "name", "regulation" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_name_idx" ON "Card"("name");
CREATE INDEX "Card_kind_idx" ON "Card"("kind");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isadmin" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("id", "name", "password") SELECT "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Race_name_key" ON "Race"("name");
