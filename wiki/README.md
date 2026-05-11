# プロジェクト Wiki 📚

このディレクトリは、プロジェクトの開発に関する自分用のドキュメント・参考情報をまとめたスペースです。

---

## 📄 目次

### フレームワーク・ライブラリ

1. **[📦 インストール済みライブラリ一覧](./LIBRARIES.md)**
   - Client・Serverの全依存パッケージ
   - 各ライブラリの機能説明
   - 使用例とコード実装

2. **[Tailwind CSS セットアップガイド](./TAILWIND_CSS_SETUP.md)**
   - Tailwind CSS v4 の導入方法
   - 設定ファイルの説明
   - 旧 CSS → Tailwind クラス対応表
   - 使用例とカスタマイズ方法

3. **[Prisma セットアップガイド](./PRISMA_SETUP.md)**
   - Prisma の起動準備
   - 環境変数の設定
   - マイグレーションの実行方法
   - Prisma Studio の起動

---

## 💡 使用技術スタック

### フロントエンド
- **React 19.2.0** - UI フレームワーク
- **Vite 8.0.0-beta.15** - ビルドツール
- **TypeScript ~5.9.3** - 型安全言語
- **React Router 7.13.2** - ルーティング
- **Tailwind CSS 4.x** - スタイリング

### サーバー
- **Node.js** - ランタイム
- **Express** (推定) - Web フレームワーク
- **Prisma 7.5.0** - ORM
- **SQLite** - データベース

### ツール・開発環境
- **ESLint 9.39.1** - コード品質
- **React Hook Form 7.71.2** - フォーム管理
- **Axios 1.13.5** - HTTP クライアント
- **Bootstrap Icons 1.13.1** - アイコンセット

---

## 🚀 クイックスタート

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# プロダクション起動
npm start
```

**ポート:**
- クライアント: http://localhost:5175 (自動アサイン)
- サーバー: http://localhost:3000

---

## 📁 プロジェクト構造

```
d:\0.7\
├── client/                    # フロントエンド (React)
│   ├── src/
│   │   ├── App.tsx           # ルートコンポーネント
│   │   ├── main.tsx          # エントリーポイント
│   │   ├── index.css         # グローバルスタイル
│   │   ├── BIGsign/          # ログイン・登録ページ
│   │   ├── Main_comportnents/ # メインコンテンツ
│   │   ├── Oth_compornents/  # 共通コンポーネント
│   │   ├── engine/           # ゲームロジック
│   │   ├── routes/           # ルート定義
│   │   └── types/            # TypeScript 型定義
│   ├── tailwind.config.js    # Tailwind 設定
│   ├── postcss.config.js     # PostCSS 設定
│   └── vite.config.ts        # Vite 設定
├── server/                    # バックエンド (Node.js)
│   ├── src/
│   ├── prisma/               # データベーススキーマ
│   └── generated/            # Prisma 自動生成ファイル
└── wiki/                      # 自分用ドキュメント (このフォルダ)
```

---

## 📌 よく使うコマンド

```bash
# 開発環境
npm run dev                 # クライアント＋サーバー同時起動

# ビルド
npm run build              # 本番ビルド
npm run build:client       # クライアントのみビルド

# リント
npm run lint               # ESLint チェック

# データベース（サーバー側で実行）
cd server
npx prisma migrate dev    # マイグレーション
npx prisma studio        # Prisma Studio (GUI)
```

---

## 🔗 関連ファイル

### プロジェクト root のドキュメント
- [REACT_ROUTER_EXPLANATION.md](../REACT_ROUTER_EXPLANATION.md) - React Router説明
- [React-Router_Migration_Guide.md](../React-Router_Migration_Guide.md) - React Router移行ガイド
- [SETUP.md](../SETUP.md) - セットアップガイド

---

## 📝 メモ・参考

### 課題・To Do
- [ ] レスポンシブデザインの完全化
- [ ] ダークモード対応
- [ ] パフォーマンス最適化
- [ ] ゲームロジックの実装完了

### 既知の問題
- Bootstrap Icons との統合調査
- ゲームエンジン部分（`boardgame.io`）未実装

---

**Last Updated**: 2026年4月18日
