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

-- CreateTable
CREATE TABLE "Tribe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CharacterTribe" (
    "characterId" INTEGER NOT NULL,
    "tribeId" INTEGER NOT NULL,

    PRIMARY KEY ("characterId", "tribeId"),
    CONSTRAINT "CharacterTribe_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CharacterTribe_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "matchData" JSONB,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoryDeck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "deckName" TEXT,
    "deckData" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HistoryDeck_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "Tribe_name_key" ON "Tribe"("name");

-- CreateIndex
CREATE INDEX "History_userId_idx" ON "History"("userId");

-- CreateIndex
CREATE INDEX "History_opponentId_idx" ON "History"("opponentId");

-- CreateIndex
CREATE INDEX "History_playedAt_idx" ON "History"("playedAt");

-- CreateIndex
CREATE INDEX "HistoryDeck_historyId_idx" ON "HistoryDeck"("historyId");

-- CreateIndex
CREATE INDEX "HistoryDeck_userId_idx" ON "HistoryDeck"("userId");

-- CreateIndex
CREATE INDEX "HistoryDeck_opponentId_idx" ON "HistoryDeck"("opponentId");

-- CreateIndex
CREATE UNIQUE INDEX "HistoryDeck_historyId_userId_key" ON "HistoryDeck"("historyId", "userId");
