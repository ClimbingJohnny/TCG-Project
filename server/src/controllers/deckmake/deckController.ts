import type { Request, Response } from 'express';
import * as deckService from '../../services/deckmake/deckService.ts';

/**
 * デッキ操作のコントローラー
 */

/**
 * デッキを作成
 */
export const createDeck = async (req: Request, res: Response) => {
  try {
    const { deckName } = req.body;
    const userId = (req as any).userId; // JWTから取得したユーザーID

    if (!deckName) {
      return res.status(400).send('デッキ名を指定してください。');
    }

    const result = await deckService.createDeck(userId, deckName);

    if (result.success) {
      res.json({
        message: 'デッキを作成しました。',
        deck: result.deck
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * ユーザーのデッキ一覧を取得
 */
export const getMyDecks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const result = await deckService.getUserDecks(userId);

    if (result.success) {
      res.json({
        message: 'デッキ一覧を取得しました。',
        decks: result.decks
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * 特定のデッキを取得
 */
export const getDeck = async (req: Request, res: Response) => {
  try {
    const { deckId } = req.params;

    const result = await deckService.getDeckById(deckId);

    if (result.success && result.deck) {
      res.json({
        message: 'デッキを取得しました。',
        deck: result.deck
      });
    } else {
      res.status(404).send('デッキが見つかりません。');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * デッキを更新
 */
export const updateDeck = async (req: Request, res: Response) => {
  try {
    const { deckId } = req.params;
    const { deckName } = req.body;

    if (!deckName) {
      return res.status(400).send('デッキ名を指定してください。');
    }

    const result = await deckService.updateDeck(deckId, deckName);

    if (result.success) {
      res.json({
        message: 'デッキを更新しました。',
        deck: result.deck
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * デッキを削除
 */
export const deleteDeck = async (req: Request, res: Response) => {
  try {
    const { deckId } = req.params;

    const result = await deckService.deleteDeck(deckId);

    if (result.success) {
      res.json({
        message: 'デッキを削除しました。'
      });
    } else {
      res.status(500).send(result.error);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
