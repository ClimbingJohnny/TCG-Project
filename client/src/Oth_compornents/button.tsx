import { useNavigate } from 'react-router-dom';

/**
 * Buttons コンポーネント（トップページ用）
 * 丸いボタンデザイン
 */
export function Buttons() {
  const navigate = useNavigate();

  return (
    <>
      {/* デッキ編成ページへ遷移 */}
      <button 
        onClick={() => navigate("/deckmake")} 
        className="w-[7%] bg-gray-300 min-w-max whitespace-nowrap mx-[5%] aspect-square rounded-full border-none shadow-md cursor-pointer transition-colors hover:bg-gray-400 active:shadow-none active:relative active:top-0.5"
      >
        デッキ編成
      </button>

      {/* ライブラリページへ遷移 */}
      <button 
        onClick={() => navigate("/library")} 
        className="w-[7%] bg-gray-300 min-w-max whitespace-nowrap mx-[5%] aspect-square rounded-full border-none shadow-md cursor-pointer transition-colors hover:bg-gray-400 active:shadow-none active:relative active:top-0.5"
      >
        ライブラリ
      </button>

      {/* ソロプレイページへ遷移 */}
      <button 
        onClick={() => navigate("/solo")} 
        className="w-[7%] bg-gray-300 min-w-max whitespace-nowrap mx-[5%] aspect-square rounded-full border-none shadow-md cursor-pointer transition-colors hover:bg-gray-400 active:shadow-none active:relative active:top-0.5"
      >
        ソロ
      </button>

      {/* デュエルページへ遷移 */}
      <button 
        onClick={() => navigate("/duel")} 
        className="w-[7%] bg-gray-300 min-w-max whitespace-nowrap mx-[5%] aspect-square rounded-full border-none shadow-md cursor-pointer transition-colors hover:bg-gray-400 active:shadow-none active:relative active:top-0.5"
      >
        デュエル
      </button>
    </>
  );
}
export function Buttons_Header() {
  // ========================================
  // 【useNavigate フック】
  // React Router DOM が提供するフック
  // 
  // 機能：
  // - プログラム的にページ遷移を実現
  // - ボタンクリックなどのユーザーアクションで、別のページに遷移
  // - URLを変更して、対応するコンポーネントを表示
  //
  // 使い方：
  // navigate("/deckmake") と呼び出すと
  // ブラウザのURLが http://localhost:5173/deckmake に変わる
  // AppRoutes.tsx の <Route path="/deckmake" element={<Deckmake />} />
  // に基づいて、Deckmake コンポーネントが表示される
  // ========================================
  const navigate = useNavigate();

  return (
    <>
      {/* ========================================
          各ボタンのクリック時の動作：
          onClick={() => navigate("/...")} により、
          指定したパスへ遷移（ページが変わる）
          ======================================== */}
      
      {/* デッキ編成ページへ遷移 */}
      <button onClick={() => navigate("/deckmake")} className="bg-gray-300 px-6 py-2 mx-0.5 border-2 border-black rounded shadow-md cursor-pointer transition-all hover:bg-gray-400 hover:shadow-lg active:shadow-none active:translate-y-0.5">
        デッキ編成
      </button>

      {/* ライブラリページへ遷移 */}
      <button onClick={() => navigate("/library")} className="bg-gray-300 px-6 py-2 mx-0.5 border-2 border-black rounded shadow-md cursor-pointer transition-all hover:bg-gray-400 hover:shadow-lg active:shadow-none active:translate-y-0.5">
        ライブラリ
      </button>

      {/* ソロプレイページへ遷移 */}
      <button onClick={() => navigate("/solo")} className="bg-gray-300 px-6 py-2 mx-0.5 border-2 border-black rounded shadow-md cursor-pointer transition-all hover:bg-gray-400 hover:shadow-lg active:shadow-none active:translate-y-0.5">
        ソロ
      </button>

      {/* デュエルページへ遷移 */}
      <button onClick={() => navigate("/duel")} className="bg-gray-300 px-6 py-2 mx-0.5 border-2 border-black rounded shadow-md cursor-pointer transition-all hover:bg-gray-400 hover:shadow-lg active:shadow-none active:translate-y-0.5">
        デュエル
      </button>
    </>
  );
}