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