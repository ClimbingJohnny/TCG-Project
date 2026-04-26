# React-Router への移行手順書

**目的**: 現在の`onMove`プロップを使用したページ遷移から、React Router を使用したページ遷移へ移行する

**実施日**: 2026年4月2日

---

## 📋 現在の実装状況

### 現在の仕組み
- **状態管理**: `App.tsx`で`page`状態を管理
- **遷移方式**: `onMove`プロップで親コンポーネントから子コンポーネントへコールバック関数を渡している
- **ページ定義**: `page.ts`に`Page`型として定義
- **インストール状態**: `react-router-dom`はすでに`package.json`に含まれている

### 現在のページ構成
```
- top (初期ページ)
- deckmake (デッキ編成)
- library (ライブラリ)
- solo (ソロプレイ)
- duel (デュエル)
- Game (ゲーム)
```

---

## 🔧 段階的な移行手順

### **STEP 1**: メインのルーティング設定ファイルを作成

**ファイル**: `src/routes/AppRoutes.tsx` ✅ **実装完了**

```tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../BIGsign';
import { Footer } from '../BIGsign';
import { TOP as Top, Deckmake, Library, Solo, Duel } from '../Main_comportnents';

export function AppRoutes() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/deckmake" element={<Deckmake />} />
          <Route path="/library" element={<Library />} />
          <Route path="/solo" element={<Solo />} />
          <Route path="/duel" element={<Duel />} />
          <Route path="/game" element={<Solo />} />
          {/* 不正なパスへのアクセスはトップページへリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
```

---

### **STEP 2**: App.tsx を簡潔にリファクタリング

**ファイル**: `src/App.tsx` ✅ **実装完了**

```tsx
import { useState, useEffect } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { Login_register as Login } from './BIGsign'
import './App.css'

function App() {
  // ログイン状態の管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [YourID, setYourID] = useState("test");

  // サーバーメッセージの管理
  const [message, setMessage] = useState('');

  // ログイン完了時の処理
  const setLoginOK = (LoginName: string) => {
    setYourID(LoginName);
    setIsAuthenticated(true);
  };

  // 初期データ取得
  useEffect(() => {
    fetch("http://localhost:3000")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage('Error: ' + err.message));
  }, []);

  // 自動ログイン
  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setLoginOK(data.username);
      })
      .catch((e) => {
        console.log("meのエラー:", e);
      });
  }, []);

  return (
    <>
      {!isAuthenticated && <Login onAuthSuccess={setLoginOK} />}
      <div className='YourID'>
        <p>{YourID}</p>
      </div>
      <AppRoutes />
      <p>{message}</p>
    </>
  );
}

export default App;
```

---

### **STEP 3**: Header.tsx を更新

**ファイル**: `src/BIGsign/Header.tsx` ✅ **実装完了**

```tsx
import Button from "../Oth_compornents/button";

function Header() {
  return (
    <>
      <header>
        <p className="header-logo">これはヘッダーです。</p>
        <div className="D-buttons">
          <Button />
        </div>
        <i className="bi bi-gear icon-header-option"></i>
      </header>
    </>
  );
}

export default Header;
```

**変更点**:
- `onMove`プロップを削除
- `Navigate`型のインポートを削除

---

### **STEP 4**: Top.tsx を更新

**ファイル**: `src/BIGsign/top.tsx` ✅ **実装完了**

```tsx
import "./style.css";
import Buttons from "../Oth_compornents/button";

function Top() {
  return (
    <>
      <h1 className="SAMNE">Welcome to TCG0.2</h1>
      <div className="top-buttons">
        <Buttons />
      </div>
    </>
  );
}

export default Top;
```

**変更点**:
- `onMove`プロップを削除
- `Navigate`型のインポートを削除

---

### **STEP 5**: Button コンポーネントを更新

**ファイル**: `src/Oth_compornents/button.tsx` ✅ **実装完了**

```tsx
import { useNavigate } from 'react-router-dom';

export default function Buttons() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/deckmake")} className="deck_b b-p">
        デッキ編成
      </button>
      <button onClick={() => navigate("/library")} className="libraly_b b-p">
        ライブラリ
      </button>
      <button onClick={() => navigate("/solo")} className="solo_b b-p">
        ソロ
      </button>
      <button onClick={() => navigate("/duel")} className="duel_b b-p">
        デュエル
      </button>
    </>
  );
}
```

**変更点**:
- `useNavigate`フックをインポートして使用
- `onMove`プロップを削除
- `Navigate`型のインポートを削除
- `navigate()`で各ページへ遷移

---

### **STEP 6**: 主要ページコンポーネントを更新

✅ **実装完了**

以下のコンポーネントについて、`onMove`プロップを削除し`useNavigate()`に置き換えました:
- `src/Main_comportnents/deckmake/deckmake.tsx` (Deckmake) ✅
- `src/Main_comportnents/library/library.tsx` (Library) ✅
- `src/Main_comportnents/solo/solo.tsx` (Solo) ✅
- `src/Main_comportnents/duel/duel.tsx` (Duel) ✅
- `src/Main_comportnents/solo/solo_robby.tsx` (SoloRobby) ✅

**例** (Deckmake.tsx):
```tsx
import {default as Go_top} from "../../Oth_compornents/go_top"
import '../style.css'

function Deckmake() {
  return(
    <div className="DeckMake">
      <p>これはデッキ編集です。</p>
      {/* コンポーネント内容 */}
      <Go_top />
    </div>
  )
}

export default Deckmake;
```

---

### **STEP 7**: navigation.ts の型定義を更新

**ファイル**: `src/engine/navigation.ts` ✅ **実装完了**

```tsx
// src/engine/navigation.ts

/**
 * ページパスの型定義
 * React Router で使用するパスを定義
 */
export type PagePath = 
  | "/"
  | "/deckmake"
  | "/library"
  | "/solo"
  | "/duel"
  | "/game";

/**
 * 初期ページパス
 */
export const INITIAL_PAGE: PagePath = "/";

/**
 * ページパスと説明のマッピング
 */
export const PAGES = {
  TOP: "/",
  DECKMAKE: "/deckmake",
  LIBRARY: "/library",
  SOLO: "/solo",
  DUEL: "/duel",
  GAME: "/game",
} as const;

/**
 * Top画面から遷移可能なページ一覧（任意）
 */
export const TOP_PAGES: PagePath[] = [
  "/deckmake",
  "/library",
  "/solo",
  "/duel",
];

/**
 * デッキ編集画面から遷移可能なページ一覧 
 */
export const DECKMAKE_PAGES: PagePath[] = [
  "/deckmake",
  "/library",
  "/duel",
]
```

---

### **STEP 8**: main.tsx を更新

**ファイル**: `src/main.tsx` ✅ **確認済み**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**変更点**: 基本的に変更なし（すでに正しい構造）

---

### **STEP 9**: types/page.ts を更新

**ファイル**: `src/types/page.ts` ✅ **実装完了**

```tsx
/**
 * React Router での新しいページパス型定義
 * engine/navigation.ts の PagePath を使用することを推奨します
 */
export type Page = 
  | "/"
  | "/deckmake"
  | "/library"
  | "/solo"
  | "/duel"
  | "/game";

/**
 * 古いPage型との互換性マッピング（参考用）
 */
export const pagePathMap: Record<string, string> = {
  "top": "/",
  "deckmake": "/deckmake",
  "deckmaking": "/deckmake",
  "cardmaking": "/deckmake",
  "library": "/library",
  "solo": "/solo",
  "duel": "/duel",
  "Game": "/game",
};
```

---

### **STEP 10**: Go_top コンポーネントを更新

**ファイル**: `src/Oth_compornents/go_top.tsx` ✅ **実装完了**

```tsx
import { useNavigate } from 'react-router-dom';

export default function Go_top() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/")} className="Top b-p">
        トップへ戻る
      </button>
    </>
  );
}
```

---

### **STEP 11**: その他のコンポーネント修正

✅ **実装完了**

以下のコンポーネントも修正されました:
- `src/Main_comportnents/deckmake/newcardmake.tsx` - `onMove`プロップを削除

---

## ✅ 検証チェックリスト

移行後に以下をテストしてください：

- [x] アプリケーションが起動する
- [x] トップページが表示される
- [x] ボタンをクリックするとページ遷移する
- [ ] ブラウザの戻る・進むボターが機能する
- [ ] ダイレクトURLアクセス（例: `/deckmake`）が機能する
- [ ] 不正なパスへのアクセスがトップページにリダイレクトされる
- [ ] ログイン機能が正常に動作する
- [ ] YourID表示が表示される

---

## 🔄 段階的な実装推奨順序

✅ **以下のSTEPが完了しました：**

1. **STEP 1** - AppRoutes.tsx を作成 ✅
2. **STEP 2** - App.tsx をリファクタリング ✅
3. **STEP 3** - Header.tsx を更新 ✅
4. **STEP 4** - Top.tsx を更新 ✅
5. **STEP 5** - Button.tsx を更新 ✅
6. **STEP 6** - ページコンポーネント（Deckmake, Library, Solo, Duel）を更新 ✅
7. **STEP 7** - navigation.ts を更新 ✅
8. **STEP 8** - main.tsx 確認 ✅
9. **STEP 9** - types/page.ts を整理 ✅
10. **STEP 10** - Go_top.tsx を更新 ✅
11. **STEP 11** - その他のコンポーネント修正 ✅

**次のステップ**: 検証とテスト

---

## 📝 補足

### Router の配置について
- 本手順では`AppRoutes.tsx`で`Router`を配置しています
- 代わりに`main.tsx`で`Router`を配置することもできます
- 大規模アプリではグローバル`Router`設定が推奨されます

### useNavigate と Link の使い分け
- **useNavigate**: プログラマティックな遷移（クリック後の処理など）
- **Link**：シンプルなリンク遷移

### パス命名について
- スラッシュから始まるパス（`/deckmake`）を使用しています
- URL構造として標準的です

### 修正内容の概要
以下の点が修正・実装されました：
- `navigate.ts`: 古い `Navigate` 型を削除し、`PagePath` 型に統一
- `types/page.ts`: 新しいPath型に更新し、互換性マッピングを追加
- 全コンポーネント: `onMove` プロップベースのシステムから `useNavigate` フックに統一
- `go_top.tsx`: プロップ不要なナビゲーションコンポーネントに改修
- `button.tsx`: 正しい export default 構文に修正

---

## ⚠️ よくある問題と解決策

### Q: "Cannot find module 'react-router-dom'"
**A**: `npm install` または `yarn install` を実行してください

### Q: ページ遷移後にレイアウトが崩れる
**A**: `main > Routes`が正しく配置されているか確認してください

### Q: ボタンクリックで何も起こらない
**A**: `useNavigate()`が`Router`内で使用されているか確認してください

### Q: コンパイルエラーが発生する
**A**: 
- TypeScript のエラーメッセージを確認してください
- 型定義ファイル（`types/page.ts`、`engine/navigation.ts`）が正しく更新されているか確認してください
- 古い `Navigate` 型や `onMove` プロップが残っていないか確認してください

---

**実装完了日**: 2026年4月18日
**実装者**: GitHub Copilot

