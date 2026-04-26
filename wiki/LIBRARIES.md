# 📦 インストール済みライブラリ一覧

このドキュメントでは、プロジェクトで使用されているnpmパッケージの機能と使用例を記載しています。

---

## 📋 目次

- [フロントエンド（Client）](#フロントエンドclient)
  - [UI・スタイリング](#uiスタイリング)
  - [フォーム・状態管理](#フォーム状態管理)
  - [ルーティング](#ルーティング)
  - [HTTP通信](#http通信)
  - [アイコン・フォント](#アイコンフォント)
- [バックエンド（Server）](#バックエンドserver)
  - [Webフレームワーク](#webフレームワーク)
  - [データベース](#データベース)
  - [認証・セキュリティ](#認証セキュリティ)
  - [その他ユーティリティ](#その他ユーティリティ)

---

## フロントエンド（Client）

### UI・スタイリング

#### **React 19.2.0** 📱
UIライブラリ。コンポーネントベースのアプリケーション構築

```typescript
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

---

#### **React DOM 19.2.0** 🎨
ReactコンポーネントをDOMにレンダリング

```typescript
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
```

---

#### **Tailwind CSS 4.2.2** 🎨
ユーティリティファーストなCSSフレームワーク。クラス名を組み合わせてスタイル定義

```html
<!-- パディング、背景色、テキスト色を組み合わせて使用 -->
<div class="p-4 bg-blue-500 text-white rounded-lg">
  ボタン
</div>

<!-- レスポンシブデザイン -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>グリッドアイテム</div>
</div>
```

詳細は [TAILWIND_CSS_SETUP.md](./TAILWIND_CSS_SETUP.md) を参照

---

#### **@mui/material 9.0.0** & **@emotion/react 11.14.0** & **@emotion/styled 11.14.1** 🎭
Material-UI（MUI）とEmotionライブラリ。プロフェッショナルなUIコンポーネント

```typescript
import { Button, Card, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

// Emotionを使ったカスタムスタイル
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: '10px 20px',
  borderRadius: '4px',
}));

export function LoginForm() {
  return (
    <Card>
      <TextField label="ユーザー名" fullWidth />
      <TextField label="パスワード" type="password" fullWidth />
      <CustomButton variant="contained">ログイン</CustomButton>
    </Card>
  );
}
```

---

#### **styled-components 6.4.1** 💅
CSS-in-JSライブラリ。Reactコンポーネントにスコープ付きスタイルを定義

```typescript
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  margin-bottom: 10px;
  
  &:hover {
    color: #0066cc;
  }
`;

export function MyComponent() {
  return (
    <Container>
      <Title>タイトル</Title>
    </Container>
  );
}
```

---

#### **Bootstrap 5.3.8** & **Bootstrap Icons 1.13.1** 🎯
CSSフレームワークとアイコンセット

```html
<!-- レスポンシブグリッド -->
<div class="container">
  <div class="row">
    <div class="col-md-6">左側（50%）</div>
    <div class="col-md-6">右側（50%）</div>
  </div>
</div>

<!-- Bootstrapボタン -->
<button class="btn btn-primary">ボタン</button>

<!-- Bootstrapアラート -->
<div class="alert alert-success" role="alert">
  成功！
</div>
```

```typescript
// アイコンの使用例
import { Heart, Star, Download } from 'react-bootstrap-icons';

export function IconExample() {
  return (
    <div>
      <Heart size={24} color="red" />
      <Star size={24} color="gold" />
      <Download size={24} />
    </div>
  );
}
```

---

#### **@fontsource/roboto 5.2.10** 🔤
Google FontsからRobotoフォントをセルフホスト

```css
/* main.tsx または index.css で import */
@import '@fontsource/roboto';

/* CSSで使用 */
body {
  font-family: 'Roboto', sans-serif;
}
```

---

### フォーム・状態管理

#### **React Hook Form 7.71.2** 📝
パフォーマンス最適化されたフォーム管理ライブラリ

```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  username: string;
  email: string;
  password: string;
}

export function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('フォームデータ:', data);
    // サーバーに送信
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input 
          {...register('username', { required: 'ユーザー名は必須です' })} 
          placeholder="ユーザー名"
        />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <input 
          {...register('email', { 
            required: 'メールアドレスは必須です',
            pattern: { value: /^\S+@\S+$/i, message: '有効なメールアドレスを入力してください' }
          })} 
          placeholder="メールアドレス"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">登録</button>
    </form>
  );
}
```

---

### ルーティング

#### **React Router 7.13.2** 🛣️
SPAのルーティング管理

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

// ページ内でのリンク遷移
import { Link, useNavigate } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/">ホーム</Link>
      <Link to="/dashboard">ダッシュボード</Link>
      <button onClick={() => navigate('/login')}>ログイン</button>
    </nav>
  );
}
```

詳細は [React-Router_Migration_Guide.md](./React-Router_Migration_Guide.md) を参照

---

### HTTP通信

#### **Axios 1.13.5** 🔗
HTTPクライアント。サーバーとの通信を簡潔に

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

// GET例：ユーザー情報取得
export async function fetchUserProfile(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('ユーザー取得失敗:', error);
  }
}

// POST例：ログイン
export async function login(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    // JWTトークンをローカルストレージに保存
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('ログイン失敗:', error);
  }
}

// PUT例：プロフィール更新
export async function updateProfile(userId: string, data: any) {
  try {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('プロフィール更新失敗:', error);
  }
}

// インターセプター：全リクエストにトークンを添付
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### TypeScript型定義

#### **@types/react 19.2.7** & **@types/react-dom 19.2.3** 📘
React のTypeScript型定義

```typescript
import { ReactNode, FC } from 'react';

interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const MyButton: FC<ButtonProps> = ({ onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
```

---

## バックエンド（Server）

### Webフレームワーク

#### **Express 5.2.1** 🚀
Node.jsの最小限で柔軟なWebアプリケーションフレームワーク

```typescript
import express from 'express';

const app = express();

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルート定義
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // 認証ロジック
  res.json({ token: 'jwt_token_here' });
});

// エラーハンドリング
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('サーバー起動: http://localhost:3000');
});
```

---

#### **Helmet 8.1.0** 🛡️
Express アプリケーションのセキュリティヘッダー設定

```typescript
import helmet from 'helmet';

app.use(helmet());
// これにより以下のセキュリティヘッダーが自動的に設定されます：
// - Content-Security-Policy
// - X-Frame-Options
// - X-Content-Type-Options
// - Strict-Transport-Security
```

---

#### **CORS 2.8.6** 🌐
クロスオリジンリクエスト（CORS）を許可・制限

```typescript
import cors from 'cors';

// デフォルト設定（すべてのオリジンを許可）
app.use(cors());

// カスタム設定
app.use(cors({
  origin: 'http://localhost:5173',  // フロントエンドのオリジン
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

---

#### **Cookie Parser 1.4.7** 🍪
リクエストのクッキーをパース

```typescript
import cookieParser from 'cookie-parser';

app.use(cookieParser());

app.post('/login', (req, res) => {
  res.cookie('sessionId', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 3600000, // 1時間
  });
  res.json({ message: 'ログイン成功' });
});

app.get('/profile', (req, res) => {
  const sessionId = req.cookies.sessionId;
  console.log('セッションID:', sessionId);
  res.json({ user: 'user_data' });
});
```

---

### データベース

#### **Prisma 7.5.0** 🗄️
モダンなORM。SQLスキーマを定義してデータベース操作

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ユーザー作成
async function createUser(email: string, name: string) {
  return await prisma.user.create({
    data: {
      email,
      name,
    },
  });
}

// ユーザー取得
async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: { decks: true }, // リレーション含める
  });
}

// ユーザー更新
async function updateUser(id: string, data: any) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

// ユーザー削除
async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

// リスト取得
async function getAllUsers() {
  return await prisma.user.findMany({
    skip: 0,
    take: 10, // ページネーション
  });
}
```

schema.prismaでスキーマ定義：
```prisma
model User {
  id    String     @id @default(cuid())
  email String     @unique
  name  String
  decks Deck[]
  createdAt DateTime @default(now())
}

model Deck {
  id     String @id @default(cuid())
  name   String
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

---

#### **Better SQLite3 12.6.2** & **@prisma/adapter-better-sqlite3 7.5.0** 💾
軽量で高速なSQLiteデータベース。本番環境で十分なパフォーマンス

```typescript
import Database from 'better-sqlite3';

const db = new Database('app.db');

// SQL実行
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(123);

// トランザクション
const transaction = db.transaction((data: any) => {
  db.prepare('INSERT INTO users (name) VALUES (?)').run(data.name);
  db.prepare('UPDATE stats SET user_count = user_count + 1').run();
});

transaction({ name: 'John Doe' });
```

---

### 認証・セキュリティ

#### **bcrypt 6.0.0** & **bcryptjs 3.0.3** 🔐
パスワードのハッシュ化。複数バージョンでセキュリティ向上

```typescript
import bcrypt from 'bcrypt';

// パスワードハッシュ化
async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// ユーザー登録時
async function registerUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

// ログイン時の検証
async function validatePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !await validatePassword(password, user.password)) {
    throw new Error('メールアドレスまたはパスワードが間違っています');
  }
  
  return user;
}
```

---

#### **jsonwebtoken 9.0.3** 🎫
JWT（JSON Web Token）の生成・検証

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// トークン生成
function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// ログイン後
async function login(email: string, password: string) {
  const user = await validatePassword(email, password);
  const token = generateToken(user.id);
  
  return {
    token,
    user: { id: user.id, email: user.email },
  };
}

// ミドルウェア：トークン検証
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: '認可がありません' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: '無効なトークンです' });
    }
    req.user = user;
    next();
  });
}

// 保護されたルート
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: `ユーザーID: ${req.user.userId}` });
});
```

---

### その他ユーティリティ

#### **dotenv 17.3.1** 🔑
環境変数を`.env`ファイルから読み込む

```typescript
import dotenv from 'dotenv';

dotenv.config(); // .env ファイル読み込み

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
```

`.env` ファイル例：
```
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=your_secret_key_here
```

---

#### **Zod 4.3.6** ✅
TypeScriptの動的スキーマ検証

```typescript
import { z } from 'zod';

// スキーマ定義
const UserSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
  name: z.string().min(1, '名前は必須です'),
});

type User = z.infer<typeof UserSchema>;

// リクエストボディの検証
app.post('/api/users', (req, res) => {
  try {
    const user = UserSchema.parse(req.body);
    // ユーザー作成
    res.json({ success: true, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    }
  }
});
```

---

#### **Nodemon 3.1.14** 👀
ファイル変更を監視して自動的にサーバーを再起動

```json
{
  "scripts": {
    "start": "nodemon --exec tsx src/index.ts"
  }
}
```

ファイルを保存すると、自動的にサーバーが再起動されます。

---

#### **tsx 4.21.0** ⚡
TypeScriptコードを直接実行。Node.jsより高速

```bash
# TypeScriptファイルを直接実行
tsx src/index.ts

# Nodemonと組み合わせて使用
nodemon --exec tsx src/index.ts
```

---

## 🔗 参考リソース

- [React公式ドキュメント](https://react.dev)
- [Tailwind CSS ドキュメント](https://tailwindcss.com)
- [Express.js ガイド](https://expressjs.com)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [React Hook Form ドキュメント](https://react-hook-form.com)

---

**最終更新：2026年4月25日**
