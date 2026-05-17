-- CreateTable
CREATE TABLE "History" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "userDeckId" INTEGER NOT NULL,
    "opponentDeckId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "matchData" JSONB,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_userDeckId_fkey" FOREIGN KEY ("userDeckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "History_opponentDeckId_fkey" FOREIGN KEY ("opponentDeckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "History_userId_idx" ON "History"("userId");

-- CreateIndex
CREATE INDEX "History_opponentId_idx" ON "History"("opponentId");

-- CreateIndex
CREATE INDEX "History_userDeckId_idx" ON "History"("userDeckId");

-- CreateIndex
CREATE INDEX "History_opponentDeckId_idx" ON "History"("opponentDeckId");

-- CreateIndex
CREATE INDEX "History_playedAt_idx" ON "History"("playedAt");
