/*
  Warnings:

  - You are about to drop the column `opponentDeckId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `userDeckId` on the `History` table. All the data in the column will be lost.

*/
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
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "matchData" JSONB,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_History" ("id", "matchData", "opponentId", "playedAt", "result", "userId") SELECT "id", "matchData", "opponentId", "playedAt", "result", "userId" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
CREATE INDEX "History_userId_idx" ON "History"("userId");
CREATE INDEX "History_opponentId_idx" ON "History"("opponentId");
CREATE INDEX "History_playedAt_idx" ON "History"("playedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "HistoryDeck_historyId_idx" ON "HistoryDeck"("historyId");

-- CreateIndex
CREATE INDEX "HistoryDeck_userId_idx" ON "HistoryDeck"("userId");

-- CreateIndex
CREATE INDEX "HistoryDeck_opponentId_idx" ON "HistoryDeck"("opponentId");

-- CreateIndex
CREATE UNIQUE INDEX "HistoryDeck_historyId_userId_key" ON "HistoryDeck"("historyId", "userId");
