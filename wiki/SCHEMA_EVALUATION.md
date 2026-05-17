# Prisma スキーマ評価レポート

## 📊 スキーマ構造図

```
User (1) ──┬─→ (N) Deck
           ├─→ (N) History (as Player)
           └─→ (N) History (as Opponent)

Deck (1) ──→ (N) DeckCard ──→ (1) Card

Card (1) ──┬─→ (0..1) Character
           ├─→ (0..1) Spell
           ├─→ (0..1) Trap
           └─→ (1) Race

History (1) ──→ (N) HistoryDeck
```

---

## ✅ 現在の設計の強み

### 1. **正規化が適切**
- テーブル設計が第 3 正規形（3NF）に従っている
- データ冗長性が最小化されている
- 更新異常、削除異常のリスクが低い

### 2. **柔軟なカード型システム**
```typescript
// Character / Spell / Trap の 1:1 リレーション
// 各カード型に異なる属性を持たせられる
character: Character?
spell: Spell?
trap: Trap?
```
- 新しいカード型追加時に拡張しやすい
- 属性が不要なカード型は NULL でメモリ効率的

### 3. **試合履歴の完全記録**
- `HistoryDeck` で試合当時のデッキ情報を保存
- `Deck` テーブルと独立しているため、デッキ編集が履歴に影響しない ✅
- `matchData` の JSON で柔軟に詳細情報を記録

### 4. **適切なインデックス設計**
```
User: (良好)
  ✅ @unique(name) でログイン時の検索が高速

Deck: (良好)
  ✅ @index([userId]) でユーザーのデッキ取得が高速
  ✅ @index([userId, name]) で複合クエリが最適化

Card: (良好)
  ✅ @index([name]) でカード検索が高速
  ✅ @index([kind]) でカード分類検索が高速

History: (良好)
  ✅ @index([userId]) @index([opponentId]) で対戦履歴取得が高速
  ✅ @index([playedAt]) で時系列取得が高速
```

### 5. **関連削除の安全性**
- `onDelete: Cascade` が適切に設定
- 親レコード削除時に孤立レコードが発生しない

---

## ⚠️ 現在の設計の課題

### 1. **User モデルが機能不足**
```typescript
// 現在
model User {
  name String @unique           // ❌ ユーザー名とメールアドレスが区別されていない
  password String               // ❌ 平文保存？ハッシュ化されている？
  // ❌ プロフィール情報がない（説明文、アバターなど）
  // ❌ ランクシステムがない
  // ❌ ウィンレートなどの統計がない
  // ❌ バンリストの遵守状況がない
}
```

**問題点**:
- 本格的なゲームでは複数認証方式に対応必要
- プレイヤー統計を毎回計算するのは非効率
- ユーザーステータスの管理がない

### 2. **Card の type システムが曖昧**
```typescript
// 現在
kind Int                      // ❌ 0 = キャラ, 1 = 魔法, 2 = 罠？
```

**問題点**:
- `kind` が enum でなく Int → コード内で数値管理は保守性低い
- `Character/Spell/Trap` との対応関係が暗黙的
- 新しいカード型追加時に管理が複雑化

### 3. **Race テーブルの使用方法が限定的**
```typescript
// 現在
raceid Int
race Race @relation(fields: [raceid], references: [id])
```

**問題点**:
- 1 対 1 の Race 割り当て
- 複数種族のカードに対応できない
- TCG では種族相性（クラッシャー, リセットなど）が重要

### 4. **DeckCard が `count` のみ**
```typescript
// 現在
model DeckCard {
  deckId Int
  cardId Int
  count Int @default(1)    // ❌ カード情報が不足
}
```

**問題点**:
- デッキの「サイドボード」に未対応
- カードのレア度や版の管理がない
- 禁止カード判定の仕組みがない

### 5. **History/HistoryDeck の構造が冗長**
```typescript
model HistoryDeck {
  historyId Int
  userId Int              // ❌ HistoryDeck を2行作成する必要がある
  opponentId Int          // ❌ 同じ historyId で userId, opponentId が重複
  deckData Json?
}
```

**問題点**:
- 1 試合につき 2 つの HistoryDeck レコード必要
- `@@unique([historyId, userId])` の一意制約で避けられない複雑性
- クエリが複雑化しやすい

### 6. **ランキング・統計機能が欠落**
- ウィンレート、連勝記録などのデータがない
- ユーザースキル評価システムがない
- リーダーボード用の統計テーブルがない

---

## 🚀 今後の展開性に向けた改善提案

### Phase 1: 基本機能の堅牢化（短期）

#### A. `Card` の type システムを enum に統一
```prisma
enum CardKind {
  CHARACTER
  SPELL
  TRAP
}

model Card {
  // ...
  kind CardKind  // Int の代わりに enum
  // ...
}
```

**効果**:
- コード内での型安全性向上
- DB クエリの可読性向上

#### B. `User` テーブルに必須フィールドを追加
```prisma
model User {
  // ... 既存フィールド
  email String @unique             // 本確認用
  passwordHash String              // ハッシュ化推奨
  bio String?                      // プロフィール説明
  avatarUrl String?                // アバター画像
  status String @default("active") // "active", "banned", "suspended"
  winCount Int @default(0)         // キャッシュ用
  loseCount Int @default(0)        // キャッシュ用
  totalMatches Int @default(0)     // キャッシュ用
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 関連
  deck Deck[]
  historiesAsUser History[] @relation("UserHistory")
  historiesAsOpponent History[] @relation("OpponentHistory")
  userRanking UserRanking?
  achievements Achievement[]
}
```

#### C. Race を多対多に変更
```prisma
model Card {
  // ...
  cardRaces CardRace[]  // 複数種族対応
  // ...
}

model CardRace {
  cardId Int
  raceId Int
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
  race Race @relation(fields: [raceId], references: [id], onDelete: Cascade)
  
  @@id([cardId, raceId])
}

model Race {
  id Int @id @default(autoincrement())
  name String @unique
  cardRaces CardRace[]
}
```

---

### Phase 2: ゲーム機能の拡張（中期）

#### A. ランキング・統計テーブル
```prisma
model UserRanking {
  id Int @id @default(autoincrement())
  userId Int @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  rating Int @default(1200)          // Elo レーティング
  rank Int                            // 現在のランク
  winRate Float @default(0.0)        // 勝率（キャッシュ）
  consecutiveWins Int @default(0)    // 連勝記録
  totalMatches Int @default(0)       // 総試合数
  lastPlayedAt DateTime?
  updatedAt DateTime @updatedAt
  
  @@index([rating])
  @@index([rank])
}
```

#### B. バンリスト管理
```prisma
enum BanStatus {
  UNLIMITED    // 無制限
  LIMITED      // 1 枚まで
  SEMI_LIMITED // 2 枚まで
  FORBIDDEN    // 禁止
}

model Banlist {
  id Int @id @default(autoincrement())
  name String         // "Advanced Format v1.0" など
  description String?
  effectiveFrom DateTime
  effectiveUntil DateTime?
  
  cardBans CardBan[]
  createdAt DateTime @default(now())
}

model CardBan {
  id Int @id @default(autoincrement())
  banlistId Int
  cardId Int
  status BanStatus
  reason String?
  
  banlist Banlist @relation(fields: [banlistId], references: [id], onDelete: Cascade)
  
  @@unique([banlistId, cardId])
  @@index([banlistId])
}
```

#### C. サイドボード対応
```prisma
model DeckCard {
  deckId Int
  cardId Int
  count Int @default(1)
  isMainDeck Boolean @default(true)  // false なら サイドボード
  
  deck Deck @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
  
  @@id([deckId, cardId, isMainDeck])  // メイン・サイド区別
}
```

---

### Phase 3: 社会機能・進化（長期）

#### A. アチーブメント・バッジシステム
```prisma
model Achievement {
  id Int @id @default(autoincrement())
  code String @unique              // "first_win", "10_consecutive_wins"
  name String
  description String
  iconUrl String?
  
  userAchievements UserAchievement[]
}

model UserAchievement {
  userId Int
  achievementId Int
  unlockedAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  @@id([userId, achievementId])
}
```

#### B. フレンド・ブロック機能
```prisma
model UserRelation {
  id Int @id @default(autoincrement())
  userId Int
  relatedUserId Int
  type String     // "friend", "blocked"
  createdAt DateTime @default(now())
  
  @@unique([userId, relatedUserId])
  @@index([userId])
}
```

#### C. トーナメント管理
```prisma
enum TournamentStatus {
  PREPARING
  IN_PROGRESS
  FINISHED
}

model Tournament {
  id Int @id @default(autoincrement())
  name String
  description String?
  status TournamentStatus @default(PREPARING)
  maxParticipants Int
  format String  // "swiss", "double_elimination"
  
  participants TournamentParticipant[]
  matches TournamentMatch[]
  
  createdAt DateTime @default(now())
  startedAt DateTime?
  endedAt DateTime?
}

model TournamentParticipant {
  id Int @id @default(autoincrement())
  tournamentId Int
  userId Int
  score Int @default(0)
  position Int?
  
  tournament Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  
  @@unique([tournamentId, userId])
}

model TournamentMatch {
  id Int @id @default(autoincrement())
  tournamentId Int
  player1Id Int
  player2Id Int
  winnerId Int?
  
  tournament Tournament @relation(fields: [tournamentId], references: [id], onDelete: Cascade)
  
  @@unique([tournamentId, player1Id, player2Id])
}
```

---

## 📈 改善優先度

| 優先度 | 項目 | 影響度 | 実装難度 |
|------|------|------|--------|
| **P0** | CardKind を enum に | 中 | 低 ✅ |
| **P0** | User に必須フィールド追加 | 高 | 中 |
| **P1** | Race を多対多に | 中 | 中 |
| **P1** | UserRanking テーブル作成 | 高 | 低 |
| **P2** | Banlist 管理 | 中 | 高 |
| **P2** | DeckCard にサイドボード対応 | 中 | 中 |
| **P3** | Achievement システム | 低 | 中 |
| **P3** | Tournament 機能 | 低 | 高 |

---

## 💡 実装順序の推奨案

### **Sprint 1（即座）**
```prisma
// 既存スキーマに最小限の追加
- CardKind enum 導入
- User に email, passwordHash, status 追加
- UserRanking テーブル作成
```

### **Sprint 2（1-2 週間後）**
```prisma
- Race を多対多に
- DeckCard にサイドボード対応
- Banlist/CardBan テーブル作成
```

### **Sprint 3（1 ヶ月後）**
```prisma
- Achievement システム
- UserRelation（フレンド）
- Tournament 機能
```

---

## 📊 SQL クエリの最適化チェック

### ✅ 現在のスキーマで効率的なクエリ

```typescript
// ユーザーの対戦履歴（全試合）- O(log n) ✅
const allMatches = await prisma.history.findMany({
  where: {
    OR: [
      { userId: 1 },
      { opponentId: 1 }
    ]
  },
  orderBy: { playedAt: 'desc' }
});

// ユーザーのデッキ一覧 - O(log n) ✅
const decks = await prisma.deck.findMany({
  where: { userId: 1 },
  include: { cards: { include: { card: true } } }
});

// カード検索 - O(log n) ✅
const card = await prisma.card.findUnique({
  where: { id: 1 },
  include: { character: true, race: true }
});
```

### ⚠️ 改善が必要なクエリ

```typescript
// ❌ ウィンレート計算（毎回集計）
const allMatches = await prisma.history.findMany({
  where: { userId: 1 }
});
const winRate = allMatches.filter(m => m.result === 'win').length / allMatches.length;

// ✅ 改善版（UserRanking キャッシュ）
const ranking = await prisma.userRanking.findUnique({
  where: { userId: 1 }
});
const winRate = ranking.winRate;
```

---

## 🔒 セキュリティ上の注意点

| 項目 | 現在 | 推奨 |
|-----|------|------|
| **パスワード** | ❓ 不明 | Bcrypt/Argon2 で必ずハッシュ化 |
| **ユーザー認証** | JWT トークン？ | セッション管理を実装 |
| **SQL インジェクション** | ✅ Prisma で自動防止 | - |
| **N+1 クエリ** | ❌ 可能性あり | `include` 最適化が必要 |
| **権限管理** | `isadmin` のみ | ロールベースアクセス制御（RBAC）検討 |

---

## 🎯 総合評価

| 項目 | 評価 | 備考 |
|-----|------|------|
| **正規化** | ⭐⭐⭐⭐⭐ | 適切に設計されている |
| **スケーラビリティ** | ⭐⭐⭐⭐ | 基本は良好。統計キャッシュが必要 |
| **拡張性** | ⭐⭐⭐⭐ | Phase 2-3 への拡張が容易 |
| **パフォーマンス** | ⭐⭐⭐⭐ | インデックス設計が良好 |
| **セキュリティ** | ⭐⭐⭐ | パスワード管理など要確認 |
| **運用性** | ⭐⭐⭐ | ドキュメント化が必要 |

**総合スコア**: 4.0 / 5.0

---

## 🚦 次のアクション

1. **すぐ実行**: CardKind enum 導入 + User フィールド追加
2. **1 週間以内**: UserRanking テーブル作成 + 統計計算ロジック実装
3. **2 週間以内**: Race 多対多化 + サイドボード対応
4. **1 ヶ月以降**: ゲーム機能の拡張

このスキーマはスケーラブルで、段階的な機能追加が可能な設計になっています！🎉
