import { prisma } from '../../../lib/prisma';

/**
 * デッキのビジネスロジック層
 */

/**
 * デッキを作成
 */
export const createDeck = async (userId: string, deckName: string) => {
  try {
    const deck = await prisma.deck.create({
      data: {
        name: deckName,
        userId: userId
      }
    });
    return { success: true, deck };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * ユーザーのデッキ一覧を取得
 */
export const getUserDecks = async (userId: string) => {
  try {
    const decks = await prisma.deck.findMany({
      where: { userId },
      include: { cards: true }
    });
    return { success: true, decks };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * 特定のデッキを取得
 */
export const getDeckById = async (deckId: string) => {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: { cards: true }
    });
    return { success: true, deck };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * デッキを更新
 */
export const updateDeck = async (deckId: string, deckName: string) => {
  try {
    const deck = await prisma.deck.update({
      where: { id: deckId },
      data: { name: deckName }
    });
    return { success: true, deck };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * デッキを削除
 */
export const deleteDeck = async (deckId: string) => {
  try {
    await prisma.deck.delete({
      where: { id: deckId }
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};
