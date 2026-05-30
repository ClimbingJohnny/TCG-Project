import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

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
      userId: user.id.toString(), // BigIntを文字列に変換
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
    console.log('リクエストボディ:', req.body);
    console.log('username:', req.body.username, '型:', typeof req.body.username);
    console.log('password:', req.body.password, '型:', typeof req.body.password);

    //ユーザー名が空でないかの確認
    if (!req.body.username) {
      console.log('エラー: usernameが存在しません');
      return res.status(400).send('ユーザー名は必須です。');
    }
    
    if (typeof req.body.username !== 'string') {
      console.log('エラー: usernameが文字列ではありません');
      return res.status(400).send('ユーザー名は文字列である必要があります。');
    }
    
    if (req.body.username.trim() === '') {
      console.log('エラー: ユーザー名が空です');
      return res.status(400).send('ユーザー名は必須です。');
    }
    
    if (!req.body.password) {
      console.log('エラー: passwordが存在しません');
      return res.status(400).send('パスワードは必須です。');
    }
    
    if (typeof req.body.password !== 'string') {
      console.log('エラー: passwordが文字列ではありません');
      return res.status(400).send('パスワードは文字列である必要があります。');
    }
    
    if (req.body.password.trim() === '') {
      console.log('エラー: パスワードが空です');
      return res.status(400).send('パスワードは必須です。');
    }
    
    console.log('検証OK - ユーザー存在確認開始');
    // ユーザーが存在するかどうかを確認
    const existingUser = await prisma.user.findUnique({
      where: { name: req.body.username }
    });

    if (existingUser) {
      console.log('エラー: そのユーザーは既に存在しています');
      return res.status(400).send('そのデータは既に存在しています。');
    }

    console.log('既存ユーザーなし - パスワードハッシュ化開始');
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    console.log('ユーザー作成開始');
    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: req.body.username,
        password: hashedPassword
      }
    });

    console.log('ユーザー作成成功:', user.name);
    res.json({
      message: '成功です。',
      userId: user.id.toString(), // BigIntを文字列に変換
      username: user.name
    });
  } catch (err) {
    console.error('エラー発生:', err);
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
