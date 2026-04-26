# TCG Project - 開発環境セットアップ

このプロジェクトは React（Client）+ Node.js（Server）の構成で、親ディレクトリから簡単に両方を起動できるようにセットアップされています。

## 🚀 クイックスタート

### 方法1: npm コマンドを使用（推奨）

親ディレクトリ (`d:\0.7`) で以下のコマンドを実行します：

```bash
# 初回セットアップ（依存関係をインストール）
npm run install:all

# 開発環境を起動（Client + Server）
npm run dev
```

### 方法2: PowerShell スクリプトを使用（Windows）

```powershell
# PowerShell で実行
.\run-dev.ps1
```

PowerShellの実行ポリシーが制限されている場合は、以下の方法で実行してください：

```powershell
# 実行ポリシーを一時的に変更
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\run-dev.ps1
```

## 📂 プロジェクト構造

```
d:\0.7\
├── client/               # React アプリケーション
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/               # Node.js + Express サーバー
│   ├── src/
│   ├── package.json
│   └── prisma/
├── package.json          # 親プロジェクトの設定
├── run-dev.ps1          # PowerShell 起動スクリプト
└── README.md            # このファイル
```

## 🔧 利用可能なコマンド

親ディレクトリで実行可能なコマンド：

| コマンド | 説明 |
|---------|------|
| `npm run dev` | Client と Server を同時起動 |
| `npm run dev:client` | Client のみ起動 |
| `npm run dev:server` | Server のみ起動 |
| `npm run build` | Client と Server をビルド |
| `npm run build:client` | Client をビルド |
| `npm run install:all` | すべての依存関係をインストール |
| `npm run lint` | Client のコードをチェック |

## 🌐 アクセス方法

開発環境起動後：

- **Client**: [http://localhost:5173](http://localhost:5173)
- **Server**: [http://localhost:3000](http://localhost:3000)

## 📋 前提条件

- **Node.js**: v16 以上推奨
- **npm**: v7 以上推奨

以下で確認できます：

```bash
node --version
npm --version
```

## ⚠️ トラブルシューティング

### ポート競合エラー

ポート 5173 または 3000 が既に使用されている場合：

1. **Client ポート変更**:
   - `client/vite.config.ts` を編集
   - `server.port` を別のポートに変更

2. **Server ポート変更**:
   - `server/src/index.ts` を編集
   - リッスンするポート番号を変更

3. **既存プロセスを終了**:
   ```powershell
   # 5173 ポートを使用しているプロセスを終了
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

### モジュールインストールエラー

```bash
# キャッシュをクリアして再インストール
npm cache clean --force
npm run install:all
```

### concurrently がインストールされていない

```bash
# 親プロジェクトの依存関係をインストール
npm install
```

## 🛠️ 開発時のヒント

### Client のみ開発する場合

```bash
npm run dev:client
# または
cd client && npm run dev
```

### Server のみ開発する場合

```bash
npm run dev:server
# または
cd server && npm start
```

### Ctrl+C で終了

両方を起動中に Ctrl+C を押すと、自動的に両方が終了します。

## 📚 参考資料

- [Vite ドキュメント](https://vitejs.dev/)
- [React Router ドキュメント](https://reactrouter.com/)
- [Express ドキュメント](https://expressjs.com/)
- [Prisma ドキュメント](https://www.prisma.io/docs/)

---

**作成日**: 2026年4月18日
