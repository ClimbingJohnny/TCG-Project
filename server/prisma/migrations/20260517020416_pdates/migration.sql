/*
  Warnings:

  - You are about to drop the `Character` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CharacterTribe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tribe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `kind` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `matchData` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `opponentId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `playedAt` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HistoryDeck` table. All the data in the column will be lost.
  - You are about to drop the column `deckData` on the `HistoryDeck` table. All the data in the column will be lost.
  - You are about to drop the column `deckName` on the `HistoryDeck` table. All the data in the column will be lost.
  - You are about to drop the column `historyId` on the `HistoryDeck` table. All the data in the column will be lost.
  - You are about to drop the column `opponentId` on the `HistoryDeck` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `HistoryDeck` table. All the data in the column will be lost.
  - Added the required column `cardtype` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Deck_1_ID` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Deck_2_ID` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_1_Id` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_2_Id` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Character_cardId_key";

-- DropIndex
DROP INDEX "Spell_cardId_key";

-- DropIndex
DROP INDEX "Trap_cardId_key";

-- DropIndex
DROP INDEX "Tribe_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Character";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CharacterTribe";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Spell";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Trap";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Tribe";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "cardtype" TEXT NOT NULL,
    "raceid" INTEGER NOT NULL,
    "Power" INTEGER,
    "level" INTEGER,
    "effect" JSONB,
    "flavorText" TEXT,
    "regulation" INTEGER NOT NULL DEFAULT 0,
    "pack" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Card_raceid_fkey" FOREIGN KEY ("raceid") REFERENCES "Race" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("createdAt", "effect", "flavorText", "id", "name", "pack", "raceid", "regulation") SELECT "createdAt", "effect", "flavorText", "id", "name", "pack", "raceid", "regulation" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_name_idx" ON "Card"("name");
CREATE INDEX "Card_cardtype_idx" ON "Card"("cardtype");
CREATE TABLE "new_DeckCard" (
    "deckId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "historyFlug" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("deckId", "cardId"),
    CONSTRAINT "DeckCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DeckCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeckCard" ("cardId", "count", "deckId") SELECT "cardId", "count", "deckId" FROM "DeckCard";
DROP TABLE "DeckCard";
ALTER TABLE "new_DeckCard" RENAME TO "DeckCard";
CREATE TABLE "new_History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_1_Id" INTEGER NOT NULL,
    "user_2_Id" INTEGER NOT NULL,
    "Deck_1_ID" INTEGER NOT NULL,
    "Deck_2_ID" INTEGER NOT NULL,
    "log" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "History_Deck_1_ID_fkey" FOREIGN KEY ("Deck_1_ID") REFERENCES "HistoryDeck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "History_Deck_2_ID_fkey" FOREIGN KEY ("Deck_2_ID") REFERENCES "HistoryDeck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "History_user_1_Id_fkey" FOREIGN KEY ("user_1_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "History_user_2_Id_fkey" FOREIGN KEY ("user_2_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_History" ("id") SELECT "id" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
CREATE UNIQUE INDEX "History_Deck_1_ID_key" ON "History"("Deck_1_ID");
CREATE UNIQUE INDEX "History_Deck_2_ID_key" ON "History"("Deck_2_ID");
CREATE TABLE "new_HistoryDeck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_HistoryDeck" ("id") SELECT "id" FROM "HistoryDeck";
DROP TABLE "HistoryDeck";
ALTER TABLE "new_HistoryDeck" RENAME TO "HistoryDeck";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
