import { useNavigate } from 'react-router-dom';

/**
 * Go_top コンポーネント
 * トップページへ戻るボタンを表示します
 */
export default function Go_top() {
  // ========================================
  // 【useNavigate フック】
  // どのコンポーネントからでもページ遷移が可能
  // このコンポーネントは "/" （トップページ）へ戻るボタンのみを提供
  // ========================================
  const navigate = useNavigate();

  return (
    <>
      {/* 
        トップページへ遷移するボタン
        "/" はアプリのホームページ（初期ページ）を表す
        どのページからでもこのボタンで戻ることができる
      */}
      <button onClick={() => navigate("/")} className="Top b-p">
        トップへ戻る
      </button>
    </>
  );
}