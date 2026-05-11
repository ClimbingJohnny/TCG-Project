# Prisma セットアップガイド

このページでは、`server` フォルダ内で Prisma を起動・実行するための準備手順をまとめています。

## 1. 前提条件

- Node.js / npm がインストールされていること
- `server` フォルダに依存パッケージがインストールされていること
- `server/prisma.config.ts` が存在し、`DATABASE_URL` を参照していること

## 2. 依存パッケージのインストール

```bash
cd server
npm install
```

## 3. 環境変数の準備

`server/.env.example` を `server/.env` にコピーし、必要に応じて値を確認してください。

```bash
cd server
copy .env.example .env
```

Windows PowerShell を使っている場合は、次のコマンドでも同じです。

```powershell
cd server
Copy-Item .env.example .env
```

`server/.env.example` の内容:

```env
DATABASE_URL="file:./dev.db"
```

## 4. Prisma client 生成

初回またはスキーマ変更後は、次のコマンドで Prisma Client を生成します。

```bash
cd server
npm run prisma:generate
```

## 5. マイグレーションの実行

データベースを初期化し、Prisma スキーマの変更を反映させます。

```bash
cd server
npm run prisma:migrate
```

このコマンドは対話式で、次のようにマイグレーション名の入力を求めます。

```bash
? Enter a name for the new migration: 
```

例として `init` を入力して Enter します。

```bash
? Enter a name for the new migration: init
```

非対話式に実行する場合は、次のように `--name` オプションを使います。

```bash
cd server
npx prisma migrate dev --name init
```

## 6. Prisma Studio の起動

データベースを GUI で確認・編集できます。

```bash
cd server
npm run prisma:studio
```

## 7. Prisma 環境の確認

上記手順が完了したら、サーバーを起動して正常に動作するか確認します。

```bash
cd server
npm start
```

## 8. トラブルシューティング

- `DATABASE_URL` が見つからないエラー
  - `server/.env` が存在するか、同一ディレクトリでコマンドを実行しているか確認します。
- `prisma migrate dev` 実行時に失敗する場合
  - `npm install` で依存関係が正しく入っているか確認します。
  - `.env` の `DATABASE_URL` が `file:./dev.db` となっているか確認します。
- SQLite の `dev.db` ファイルが生成されない場合
  - Prisma が `server` ディレクトリをルートとして認識しているか確認します。

## 9. まとめ

1. `cd server`
2. `npm install`
3. `copy .env.example .env`
4. `npm run prisma:generate`
5. `npm run prisma:migrate`
6. `npm run prisma:studio` (必要に応じて)
