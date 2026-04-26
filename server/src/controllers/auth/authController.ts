import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma.ts';

const SECRET_KEY = 'MysecretKey';

/**
 * ログイン処理
 */
export const login = async (req: Request, res: Response) => {
  try {
    // 1. ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { name: req.body.username }
    });

    // 2. 存在しなければ弾く
    if (!user) {
      return res.status(401).send('ユーザーが見つかりません。');
    }

    // 3. パスワードを照合
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).send('パスワードが違います。');
    }

    // 4. 認証成功
    // 4.1 JWTを生成
    const token = jwt.sign(
      { userId: user.id, username: user.name },
      SECRET_KEY,
      { expiresIn: '7d' } // 7日間有効
    );

    // 4.2 クッキーにセット
    res.cookie('token', token, {
      httpOnly: true, // JSからアクセス不可（XSS対策）
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7日間
      sameSite: 'lax'
    });

    // 4.3 ユーザーに通知
    res.json({
      message: 'ログイン成功',
      userId: user.id,
      username: user.name
    });
    console.log(user.name);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * ユーザー登録処理
 */
export const register = async (req: Request, res: Response) => {
  try {
    console.log('ユーザー登録処理開始');

    //ユーザー名が空でないかの確認
    if (!req.body.username || req.body.username.trim() === '') {
      return res.status(400).send('ユーザー名は必須です。');
    }
    if (!req.body.password || req.body.password.trim() === '') {
      return res.status(400).send('パスワードは必須です。');
    }
    // ユーザーが存在するかどうかを確認
    const existingUser = await prisma.user.findUnique({
      where: { name: req.body.username }
    });

    if (existingUser) {
      return res.status(400).send('そのデータは既に存在しています。');
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: req.body.username,
        password: hashedPassword
      }
    });

    res.json({
      message: '成功です。',
      userId: user.id,
      username: user.name,
      user: user
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * ログイン状態の確認
 */
export const checkAuth = (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('未ログイン');

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
    res.json({ username: decoded.username });
  } catch {
    res.status(401).send('トークンが無効です');
  }
};
