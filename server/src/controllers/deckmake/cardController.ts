import type { Request, Response } from 'express';
import * as cardService from '../../services/deckmake/cardService.ts';

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
    const { name, type, cost, description } = req.body;

    if (!name || !type || cost === undefined) {
      return res.status(400).send('カード名、タイプ、コストは必須です。');
    }

    const result = await cardService.createCard(name, type, cost, description || '');

    if (result.success) {
      res.json({
        message: 'カードを作成しました。',
        card: result.card
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * すべてのカードを取得
 */
export const getAllCards = async (req: Request, res: Response) => {
  try {
    const result = await cardService.getAllCards();

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
