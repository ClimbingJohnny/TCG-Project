import express, { Router } from 'express';
import * as deckController from '../controllers/deckmake/deckController.ts';
import * as cardController from '../controllers/deckmake/cardController.ts';

const router = Router();

/**
 * デッキメイク関連のルート
 */

// ===== デッキ操作 =====
// デッキを作成
router.post('/deck', deckController.createDeck);

// 自分のデッキ一覧を取得
router.get('/decks', deckController.getMyDecks);

// 特定のデッキを取得
router.get('/deck/:deckId', deckController.getDeck);

// デッキを更新
router.put('/deck/:deckId', deckController.updateDeck);

// デッキを削除
router.delete('/deck/:deckId', deckController.deleteDeck);

// ===== カード操作 =====
// デッキにカードを追加
router.post('/deck/card/add', cardController.addCardToDeck);

// デッキからカードを削除
router.delete('/deck/card/:deckCardId', cardController.removeCardFromDeck);

// カードの数量を更新
router.put('/deck/card/:deckCardId', cardController.updateCardQuantity);

// 新しいカードを作成
router.post('/card', cardController.createCard);

// すべてのカードを取得
router.get('/cards', cardController.getAllCards);

export default router;
