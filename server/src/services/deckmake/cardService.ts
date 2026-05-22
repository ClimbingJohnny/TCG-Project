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
  cardtype: 'Character' | 'Spell' | 'Trap',
  raceId: number,
  level?: number,
  power?: number,
  flavorText?: string,
  effect?: Record<string, unknown> | null
) => {
  try {
    console.log("\n========== cardService.createCard 実行 ==========");
    console.log("📊 パラメータ:");
    console.log("  - name:", name);
    console.log("  - cardtype:", cardtype);
    console.log("  - raceId:", raceId);
    console.log("  - level:", level);
    console.log("  - power:", power);
    console.log("  - flavorText:", flavorText);
    console.log("  - effect:", effect);

    // effect がある場合はデータに含める
    const data: any = {
      name,
      cardtype,
      raceid: raceId,
      pack: '',
      regulation: 0,
    };

    if (level !== undefined) {
      data.level = parseInt(level.toString(), 10);
      console.log("✅ level を追加:", data.level);
    }
    if (power !== undefined) {
      data.Power = parseInt(power.toString(), 10);
      console.log("✅ Power を追加:", data.Power);
    }
    if (flavorText !== undefined) {
      data.flavorText = flavorText;
      console.log("✅ flavorText を追加:", flavorText);
    }
    if (effect) {
      data.effect = effect;
      console.log("✅ effect を追加:", effect);
    }

    console.log("📝 Prisma create() データ:", data);
    console.log("🔌 DB に接続中...");

    const card = await prisma.card.create({ data });
    
    console.log("✨ カード作成完了:", card);
    return { success: true, card };
  } catch (err) {
    console.error("❌ cardService エラー:", err);
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

/**
 * すべての種族を取得
 */
export const getAllRaces = async () => {
  // console.log("これは起動しているでしょうか。");
  try {
    const races = await prisma.race.findMany();
    return { success: true, races };
  } catch (err) {
    return { success: false, error: err };
  }
};
