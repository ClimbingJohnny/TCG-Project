import type { Request, Response } from 'express';
import * as cardService from '../../services/deckmake/cardService';

/**
 * カード操作のコントローラー
 */

/**
 * デッキにカードを追加
 */
export const addCardToDeck = async (req: Request, res: Response) => {
  try {
    const { deckId, cardId, quantity } = req.body;

    if (!deckId || !cardId) {
      return res.status(400).send('デッキIDとカードIDを指定してください。');
    }

    const result = await cardService.addCardToDeck(deckId, cardId, quantity || 1);

    if (result.success) {
      res.json({
        message: 'カードを追加しました。',
        deckCard: result.deckCard
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * デッキからカードを削除
 */
export const removeCardFromDeck = async (req: Request, res: Response) => {
  try {
    const { deckCardId } = req.params;

    const result = await cardService.removeCardFromDeck(deckCardId);

    if (result.success) {
      res.json({
        message: 'カードを削除しました。'
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * カードの数量を更新
 */
export const updateCardQuantity = async (req: Request, res: Response) => {
  try {
    const { deckCardId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).send('数量を指定してください。');
    }

    const result = await cardService.updateCardQuantity(deckCardId, quantity);

    if (result.success) {
      res.json({
        message: 'カード数量を更新しました。',
        deckCard: result.deckCard
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * 新しいカードを作成
 */
export const createCard = async (req: Request, res: Response) => {
  try {
    console.log("\n========== カード作成API呼び出し ==========");
    console.log("📨 リクエストボディ:", req.body);
    
    const { 
      name, 
      cardType, 
      level, 
      race, 
      power, 
      flavortext,
      effects
    } = req.body;

    console.log("🔍 パース済みデータ:");
    console.log("  - name:", name);
    console.log("  - cardType:", cardType);
    console.log("  - level:", level);
    console.log("  - race:", race);
    console.log("  - power:", power);
    console.log("  - flavortext:", flavortext);
    console.log("  - effects:", effects);

    // バリデーション
    if (!name || !cardType || !race) {
      console.error("❌ バリデーション失敗 - 必須フィールドが不足");
      return res.status(400).json({ 
        success: false,
        error: 'カード名、カード種類、種族は必須です。' 
      });
    }

    // cardType を Prisma の enum に変換 ('character' → 'Character')
    const cardTypeMap: Record<string, 'Character' | 'Spell' | 'Trap'> = {
      character: 'Character',
      spell: 'Spell',
      trap: 'Trap'
    };

    const mappedCardType = cardTypeMap[cardType.toLowerCase()];
    console.log("🔄 cardType変換:", cardType, "→", mappedCardType);
    
    if (!mappedCardType) {
      console.error("❌ cardType変換失敗:", cardType);
      return res.status(400).json({ 
        success: false,
        error: 'カード種類が無効です。(character|spell|trap)' 
      });
    }

    // race は race の ID（文字列）なので、数値に変換
    const raceId = parseInt(race, 10);
    console.log("🔄 raceId変換:", race, "→", raceId);
    
    if (isNaN(raceId)) {
      console.error("❌ raceId変換失敗:", race);
      return res.status(400).json({ 
        success: false,
        error: '種族IDが無効です。' 
      });
    }

    console.log("📞 cardService.createCard 呼び出し中...");
    const result = await cardService.createCard(
      name,
      mappedCardType,
      raceId,
      level ? parseInt(level, 10) : undefined,
      power ? parseInt(power, 10) : undefined,
      flavortext,
      effects ? JSON.parse(JSON.stringify(effects)) : undefined
    );

    console.log("📥 cardService.createCard 結果:", result);

    if (result.success) {
      console.log("✅ カード作成成功:", result.card);
      res.json({
        success: true,
        message: 'カードを作成しました。',
        card: result.card
      });
    } else {
      console.error("❌ cardService エラー:", result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("❌ カード作成エラー:", err);
    res.status(500).json({
      success: false,
      error: 'カード作成に失敗しました。'
    });
  }
};

/**
 * すべてのカードを取得
 */
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const result = await cardService.getAllCards();
    console.log("Cards:", result.cards);

    if (result.success) {
      res.json({
        message: 'カード一覧を取得しました。',
        cards: result.cards
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
/**
  * 全てのraceを取得
*/
export const getAllRaces = async (req: Request, res: Response) => {
  // console.log("これは起動しているでしょうか。");
  try {
    const result = await cardService.getAllRaces();

    if (result.success){
      res.json({
        message: '種族一覧を取得しました。',
        races: result.races
      });
    } else {
      res.status(500).send(result.error);
    }
  }catch (err){
    res.status(500).send(err);
  }
}