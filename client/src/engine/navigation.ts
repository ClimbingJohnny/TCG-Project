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