# React Router DOM - 仕組み解説

このドキュメントでは、アプリケーションで使用されている React Router DOM の仕組みを詳しく説明します。

---

## 🎯 React Router DOM とは？

**React Router DOM** は、React アプリケーションでページ遷移（ルーティング）を管理するライブラリです。

### 従来の方法（現在は使用していません）
```tsx
// 古い方法: page 状態で管理
const [page, setPage] = useState("top");

if (page === "deckmake") return <Deckmake />;
if (page === "library") return <Library />;
// ... 複雑で保守しにくい
```

### React Router DOM の方法（現在の実装）
```tsx
// 新しい方法: URLで管理
// http://localhost:5173/deckmake → <Deckmake /> を表示
// http://localhost:5173/library → <Library /> を表示
// ... シンプルで標準的
```

---

## 📐 アーキテクチャ

### 全体の流れ

```
ユーザーがボタンをクリック
        ↓
navigate("/deckmake") が実行される （useNavigate フック）
        ↓
URLが変更される：http://localhost:5173/deckmake
        ↓
React Router が URL を監視して変更を検知
        ↓
AppRoutes.tsx の <Route path="/deckmake" element={<Deckmake />} />
にマッチ
        ↓
<Deckmake /> コンポーネントが表示される
```

---

## 🧩 主要コンポーネント

### 1. **Router**
```tsx
<Router>
  {/* すべてのルーターコンポーネントはここの中に必要 */}
</Router>
```
- React Router の機能をアクティベート
- URL の変更を監視
- ページ遷移を処理

### 2. **Routes**
```tsx
<Routes>
  <Route path="/" element={<Top />} />
  <Route path="/deckmake" element={<Deckmake />} />
  ...
</Routes>
```
- 複数の Route コンポーネントをまとめるコンテナ
- **現在の URL にマッチする Route を1つだけ見つけて表示**
- 複数にマッチすることはない

### 3. **Route**
```tsx
<Route path="/library" element={<Library />} />
```
- **path**: ブラウザの URL パス
  - `/library` = http://localhost:5173/library
- **element**: そのパスにマッチしたときに表示するコンポーネント

### 4. **Navigate（リダイレクト）**
```tsx
<Route path="*" element={<Navigate to="/" replace />} />
```
- **path="*"**: 上記で定義されていない **すべてのパス** にマッチ
- **to="/"**: ホームページ（/）にリダイレクト
- **replace**: ブラウザの履歴を上書き
  - `replace` ない場合：戻るボタンで元のページに戻れる
  - `replace` ある場合：戻るボタンで戻れない（推奨）

### 5. **useNavigate（フック）**
```tsx
const navigate = useNavigate();

// ボタンクリック時にページ遷移
<button onClick={() => navigate("/deckmake")}>デッキ編成</button>
```
- コンポーネント内からプログラム的にページ遷移を制御
- ボタンクリック、フォーム送信など、ユーザーアクション後に使用

---

## 🔄 実装の流れ

### ステップ 1: AppRoutes.tsx でルートを定義
```tsx
<Router>
  <Routes>
    <Route path="/" element={<Top />} />
    <Route path="/deckmake" element={<Deckmake />} />
    <Route path="/library" element={<Library />} />
    ...
  </Routes>
</Router>
```

### ステップ 2: 各コンポーネントでナビゲーション
```tsx
// button.tsx
const navigate = useNavigate();
<button onClick={() => navigate("/deckmake")}>デッキ編成</button>

// go_top.tsx
<button onClick={() => navigate("/")}>トップへ戻る</button>
```

### ステップ 3: ブラウザ URL が変更
- ユーザーがボタンをクリック
- URL が `http://localhost:5173/deckmake` に変更
- React Router が変更を検知して再レンダリング

### ステップ 4: マッチしたコンポーネントが表示
- <Route path="/deckmake" element={<Deckmake />} /> にマッチ
- <Deckmake /> が表示される

---

## 📊 URL パスと表示コンポーネントのマッピング

| URL パス | ブラウザに表示される URL | コンポーネント |
|---------|-------------------------|--------------|
| `/` | http://localhost:5173/ | Top |
| `/deckmake` | http://localhost:5173/deckmake | Deckmake |
| `/library` | http://localhost:5173/library | Library |
| `/solo` | http://localhost:5173/solo | Solo |
| `/duel` | http://localhost:5173/duel | Duel |
| `/game` | http://localhost:5173/game | Solo |
| `/invalid` (存在しないパス) | http://localhost:5173/invalid | → / にリダイレクト → Top |

---

## ✨ React Router DOM の利点

### 1. **URL が保存される**
- ブラウザの戻る・進むボタンが機能
- ページを再度開いても同じページが表示される

### 2. **URL でページ共有が可能**
- `http://localhost:5173/deckmake` をコピーして友人に送信
- その URL を開くれば同じページが表示される
- 従来の state 管理ではこれができない

### 3. **標準的な Web の振る舞い**
- Web サイトのように自然なナビゲーション
- ユーザーが URL を直接入力できる

### 4. **コードが読みやすい**
- URL とコンポーネントの対応が明確
- 新しい開発者も理解しやすい

---

## 🛠️ よくある操作パターン

### パターン 1: ボタンやリンクからの遷移
```tsx
// button.tsx
<button onClick={() => navigate("/deckmake")}>
  デッキ編成へ
</button>
```

### パターン 2: 関数内からの遷移
```tsx
const handleLogin = async (username) => {
  // ログイン処理
  await login(username);
  
  // ログイン成功後に別のページへ遷移
  navigate("/deckmake");
};
```

### パターン 3: 条件付き遷移
```tsx
if (user.isAuthenticated) {
  navigate("/deckmake");
} else {
  navigate("/");
}
```

---

## ⚠️ よくある質問

### Q: URL を直接入力しても大丈夫？
**A**: 大丈夫です。React Router が URL を監視して対応するコンポーネントを表示します。

```
http://localhost:5173/deckmake を直接入力
→ <Route path="/deckmake" ... /> にマッチ
→ <Deckmake /> が表示される
```

### Q: 存在しないパスにアクセスしたら？
**A**: `<Route path="*" ... />` でキャッチされてリダイレクトされます。

```
http://localhost:5173/invalid にアクセス
→ <Route path="*" element={<Navigate to="/" replace />} />
→ / にリダイレクト
→ <Top /> が表示される
```

### Q: Header と Footer はなぜ Route の外？
**A**: すべてのページで共通して表示したいから

```tsx
<Router>
  <Header />  {/* すべてのページで表示 */}
  
  <main>
    <Routes>
      {/* ページごとに異なるコンポーネント */}
    </Routes>
  </main>
  
  <Footer />  {/* すべてのページで表示 */}
</Router>
```

---

## 📚 参考資料

- [React Router 公式ドキュメント](https://reactrouter.com/)
- [React Router v6 入門](https://react-router.com/en/main)

---

**作成日**: 2026年4月18日
