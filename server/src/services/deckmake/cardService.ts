import { prisma } from '../../../lib/prisma.ts';

/**
 * カードのビジネスロジック層
 */

/**
 * デッキにカードを追加
 */
export const addCardToDeck = async (deckId: string, cardId: string, quantity: number = 1) => {
  try {
    const deckCard = await prisma.deckCard.create({
      data: {
        deckId,
        cardId,
        quantity
      }
    });
    return { success: true, deckCard };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * デッキからカードを削除
 */
export const removeCardFromDeck = async (deckCardId: string) => {
  try {
    await prisma.deckCard.delete({
      where: { id: deckCardId }
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * デッキのカード数量を更新
 */
export const updateCardQuantity = async (deckCardId: string, quantity: number) => {
  try {
    const deckCard = await prisma.deckCard.update({
      where: { id: deckCardId },
      data: { quantity }
    });
    return { success: true, deckCard };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * 新しいカードを作成
 */
export const createCard = async (
  name: string,
  type: string,
  cost: number,
  description: string
) => {
  try {
    const card = await prisma.card.create({
      data: {
        name,
        type,
        cost,
        description
      }
    });
    return { success: true, card };
  } catch (err) {
    return { success: false, error: err };
  }
};

/**
 * すべてのカードを取得
 */
export const getAllCards = async () => {
  try {
    const cards = await prisma.card.findMany();
    return { success: true, cards };
  } catch (err) {
    return { success: false, error: err };
  }
};
