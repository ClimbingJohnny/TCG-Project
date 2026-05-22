import express, { Router } from 'express';
import { login, register, checkAuth } from '../controllers/auth/authController';

const router = Router();

/**
 * 認証関連のルート
 */

// ユーザーログイン
router.post('/login', login);

// ユーザー登録
router.post('/register', register);

// ログイン状態確認
router.get('/me', checkAuth);

export default router;
