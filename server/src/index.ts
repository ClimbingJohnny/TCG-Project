import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ルートのインポート
import authRoutes from './routes/auth';
import deckmakeRoutes from './routes/deckmake';

const app = express();

// ミドルウェア設定
// CORSの設定 - フロントエンド(localhost:5173, 5174)からのリクエストを許可
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true // クッキー認証情報を含むリクエストを許可
  })
);

app.use(express.json());
app.use(cookieParser());

// ヘルスチェック
app.get('/', (_, res) => {
  res.send('Hello World!');
});

// ルート設定
// 認証関連のルート（/login, /register, /me）
app.use('/', authRoutes);

// デッキメイク関連のルート（/deck, /cards など）
app.use('/deckmake', deckmakeRoutes);

// サーバーの起動
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});