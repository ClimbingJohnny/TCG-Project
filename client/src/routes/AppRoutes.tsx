import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '../BIGsign';
import { Footer } from '../BIGsign';
import { TOP as Top, Deckmake, Newcardmake, Library, Solo, Duel } from '../Main_comportnents';

/**
 * AppRoutes コンポーネント
 * 
 * このコンポーネントは、React Router DOM を使用して
 * アプリケーション全体のページ遷移（ルーティング）を管理します。
 */
export function AppRoutes() {
  return (
    // ========================================
    // 【Router コンポーネント】
    // React Router の機能を有効にするためのラッパー
    // - URL の変更を監視
    // - ページ遷移を制御
    // - ブラウザの戻る・進むボタンに対応
    // ========================================
    <Router>
      {/* ========================================
          【Header & Footer】
          すべてのページで共通して表示されるコンポーネント
          ログイン状態の表示や、共通ナビゲーション等に使用
          ======================================== */}
      <Header />

      <main>
        {/* ========================================
            【Routes コンポーネント】
            現在のURL に基づいて、どの Route を表示するか判定する
            ここで定義されたルートの1つだけが表示される
            ======================================== */}
        <Routes>
          
          {/* ========================================
              【Route コンポーネント】
              各ルートの設定
              - path: ブラウザのURL（例: http://localhost:5173/deckmake）
              - element: そのpassにアクセスしたときに表示するコンポーネント
              ======================================== */}
          
          {/* ホームページ / トップページ */}
          <Route path="/" element={<Top />} />
          
          {/* デッキ編成ページ */}
          <Route path="/deckmake" element={<Deckmake />} />
          
          {/* カード新規作成ページ */}
          <Route path="/newcardmake" element={<Newcardmake />} />
          
          {/* カード新規作成ページ */}
          <Route path="/newcardmake" element={<Newcardmake />} />
          
          {/* ライブラリページ */}
          <Route path="/library" element={<Library />} />
          
          {/* ソロプレイページ */}
          <Route path="/solo" element={<Solo />} />
          
          {/* デュエルページ */}
          <Route path="/duel" element={<Duel />} />
          
          {/* ゲームページ（現在は Solo コンポーネントを使用） */}
          <Route path="/game" element={<Solo />} />

          {/* ========================================
              【Navigate コンポーネント】リダイレクト処理
              - path="*": 上記で定義されていないすべてのパスにマッチ
              - element={<Navigate to="/" replace />}: 
                "/"（トップページ）にリダイレクトする
              - replace: ブラウザの履歴を上書き（戻るボタンで元のページに戻らない）
              
              例：http://localhost:5173/invalid のような存在しないパスにアクセスすると
              自動的に http://localhost:5173/ にリダイレクトされる
              ======================================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}