# Tailwind CSS セットアップガイド

## プロジェクト概要
このプロジェクトは、カスタム CSS から **Tailwind CSS v4** に移行されました。

**完了日**: 2026年4月18日
**移行対象**: クライアント側（`client/`）

---

## 📦 インストール済みパッケージ

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### パッケージ詳細
- **tailwindcss**: ユーティリティファースト CSS フレームワーク
- **postcss**: CSS 変換ツール
- **autoprefixer**: ベンダープリフィックス自動付与
- **@tailwindcss/postcss**: Tailwind v4 PostCSS プラグイン

---

## ⚙️ 設定ファイル

### 1. `tailwind.config.js`
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**説明**:
- `content`: Tailwind が走査する HTML/JSX ファイルパス
- `theme.extend`: デフォルトテーマのカスタマイズ
- `plugins`: 追加機能のプラグイン

### 2. `postcss.config.js`
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**説明**: PostCSS で Tailwind v4 プラグインを有効化

### 3. `src/index.css`
```css
@import "tailwindcss";

@import url(././BIGsign/style.css);
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");

/* グローバルスタイルはここに記載 */
```

---

## 🎨 クラス名の移行

### 旧 CSS → Tailwind クラス対応表

| 旧カスタム CSS | Tailwind クラス | 説明 |
|---|---|---|
| `.logo { height: 6em; }` | `h-24` | 高さ 6em (24 × 0.25rem) |
| `{ padding: 1.5em; }` | `p-6` | パディング 1.5em |
| `{ width: 100%; }` | `w-full` | 幅 100% |
| `{ display: flex; }` | `flex` | フレックスボックス |
| `{ flex-direction: column; }` | `flex-col` | フレックス方向: 縦 |
| `{ justify-content: center; }` | `justify-center` | 中央揃え（横） |
| `{ align-items: center; }` | `items-center` | 中央揃え（縦） |
| `{ margin-top: auto; }` | `mt-auto` | 上マージン: auto |
| `{ background-color: #f0f0f0; }` | `bg-gray-100` | 背景色: グレー |
| `{ border: 2px solid; }` | `border-2` | ボーダー 2px |
| `{ border-color: white; }` | `border-white` | ボーダー色: 白 |
| `{ transition: 0.25s; }` | `transition-colors duration-200` | トランジション |
| `{ position: fixed; }` | `fixed` | 絶対配置 |
| `{ inset: 0; }` | `inset-0` | 全方向配置 |
| `{ z-index: 100; }` | `z-50` | スタック順 |

### よく使う Tailwind クラス

**配置・レイアウト**
- `flex`, `flex-col`, `flex-row` - フレックスボックス
- `grid`, `grid-cols-2` - グリッドレイアウト
- `absolute`, `relative`, `fixed`, `sticky` - ポジション
- `top-0`, `bottom-0`, `left-0`, `right-0` - 位置指定
- `inset-0` - 上下左右すべて 0

**サイズ**
- `w-full`, `h-full`, `w-1/2` - 幅・高さ
- `aspect-square`, `aspect-video` - アスペクト比
- `min-w-max`, `max-w-screen` - 最小・最大幅

**色・背景**
- `bg-white`, `bg-gray-100`, `bg-red-500` - 背景色
- `text-white`, `text-black`, `text-gray-500` - テキスト色
- `border-2 border-white` - ボーダー
- `opacity-50`, `bg-black/40` - 透明度

**スペーシング**
- `m-4`, `mb-2`, `mx-auto` - マージン
- `p-4`, `px-8`, `py-2` - パディング

**テキスト**
- `text-sm`, `text-base`, `text-2xl`, `text-5xl` - フォントサイズ
- `font-bold`, `font-semibold` - フォント太さ
- `text-center`, `text-left`, `text-right` - テキスト配置

**ホバー・ステート**
- `hover:bg-gray-400` - ホバー時の背景色
- `focus:outline-none` - フォーカス時の枠線削除
- `active:shadow-none` - アクティブ時

---

## 📝 使用例

### Header コンポーネント
```tsx
// 旧 CSS の場合
<header className="header">
  <p className="header-logo">ロゴ</p>
</header>

// Tailwind CSS の場合
<header className="sticky top-0 w-full bg-gray-100 flex items-center justify-center">
  <p className="flex items-center justify-center px-[8%]">ロゴ</p>
</header>
```

### ログインフォーム
```tsx
// 旧 CSS
<div className="login">
  <div className="loginForm">
    ...
  </div>
</div>

// Tailwind CSS
<div className="fixed inset-0 bg-black/40 flex flex-col justify-center items-center z-50">
  <div className="bg-white border-2 border-black text-center flex flex-col flex-shrink-0">
    ...
  </div>
</div>
```

---

## 🔧 カスタマイズ方法

### テーマの拡張
`tailwind.config.js` の `theme.extend` で新しい値を追加できます：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#646cff',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
}
```

その後、コンポーネントで使用：
```jsx
<div className="bg-primary text-secondary py-128">...</div>
```

### グローバルスタイル
`src/index.css` の `@layer` で複数のクラスをまとめられます：

```css
@layer components {
  .card {
    @apply p-8 bg-white rounded-lg shadow-lg;
  }
}
```

---

## 📊 ビルド最適化

Tailwind CSS は不要なクラスを自動的に削除（PurgeCSS）するため、本番ビルドのファイルサイズが小さくなります：

**移行前後の比較**
- ビルド時間: 約 600ms
- CSS バンドルサイズ: **13.67 kB** (gzip: 3.52 kB)
- 総 JS サイズ: 300.47 kB

---

## 🚀 よくある質問

### Q: 既存の CSS クラスは残っている？
**A**: はい。互換性のため、一部のグローバルスタイルは残しています。段階的に Tailwind クラスに統合できます。

### Q: 特定のブラウザ対応をしたい場合は？
**A**: Tailwind の `variants` を使用します：
```jsx
<div className="md:flex-row flex-col">...</div>
```

### Q: 新しいコンポーネントを追加する場合は？
**A**: JSX 内に直接 Tailwind クラスを記述するだけです（CSS ファイル不要）：
```jsx
export default function Button() {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Click me
    </button>
  );
}
```

---

## 📚 参考リソース

- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com)
- [Tailwind UI](https://tailwindui.com)
- [Tailwind CSS IntelliSense (VS Code)](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---

## 🔄 移行履歴

| 日付 | 内容 |
|---|---|
| 2026-04-18 | Tailwind CSS v4 導入完了 |
| 2026-04-18 | 全コンポーネントの className Tailwind 化 |
| 2026-04-18 | ビルド・動作確認完了 |

---

## 📝 次のステップ

- [ ] 各ページのレスポンシブデザイン調整
- [ ] ダークモード対応の検討
- [ ] カスタムカラーパレットの定義
- [ ] アニメーション・トランジション の活用
