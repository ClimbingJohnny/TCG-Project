# デジタルカードゲーム — カード効果ASTシステム 設計ガイド

## 概要

カードの「条件」と「効果」をすべて **対象（Target）** と **状態（Qualifier）** の組み合わせで表現し、それをTypeScriptで実装したASTとして管理するシステムの設計・実装手順。

---

## 1. 設計思想の整理

### カード効果の構造

あらゆるカードテキストは次の2つに分解できる。

| 区分 | 意味 | 例 |
|------|------|----|
| **条件（Condition）** | 発動・適用するための前提 | 「このターン中に召喚された相手モンスター」が存在する |
| **効果（Effect）** | 実際に起きること | 「そのモンスターを破壊する」 |

そしてどちらも共通して **対象（Target）** と **状態（Qualifier）** で記述できる。

```
Target     = 誰・何に作用するか     （例: モンスター、プレイヤー、カード）
Qualifier  = Targetを限定する修飾   （例: 相手の / このターン中に召喚された / 攻撃力1000以上）
```

---

## 1.5. カードの移動を統一的に扱う仕組み

すべてのカード効果の流れ（破壊、デッキからのサーチ、復活など）を、ある地点（ゾーン）から別の地点への移動としてモデル化する。これにより、複雑な効果もシンプルに表現可能になる。

### 移動の基本概念

- **移動（Move）**: カードをあるゾーンから別のゾーンへ移動させる効果。
- **ゾーン**: デッキ、手札、フィールド、墓地、除外、EXデッキなど。
- **既存効果の再解釈**: 従来の 'destroy' は 'move' (field → graveyard) と等価。'draw' は 'move' (deck → hand) と等価。

### 移動効果の例

```ts
// 破壊効果: フィールド上のモンスターを墓地へ
{
  kind: 'effect',
  effectType: 'move',
  target: { targetType: 'monster', qualifiers: [] },
  fromZone: 'field',
  toZone: 'graveyard'
}

// デッキからのサーチ: デッキから手札へ
{
  kind: 'effect',
  effectType: 'move',
  target: { targetType: 'card', qualifiers: [{ qualifierType: 'zone', value: 'deck' }] },
  fromZone: 'deck',
  toZone: 'hand'
}

// 復活効果: 墓地からフィールドへ
{
  kind: 'effect',
  effectType: 'move',
  target: { targetType: 'monster', qualifiers: [{ qualifierType: 'zone', value: 'graveyard' }] },
  fromZone: 'graveyard',
  toZone: 'field'
}
```

この仕組みにより、動く先（toZone）は後で柔軟に変更可能。条件や他の効果との組み合わせで複雑な動きを実現できる。

---

## 2. ASTの型定義（TypeScript）

### ステップ1 — 基本ノード型を定義する

```ts
// AST の全ノードが持つ共通フィールド
type NodeKind =
  | 'card'
  | 'condition'
  | 'effect'
  | 'target'
  | 'qualifier'
  | 'sequence'   // 複数ノードの列（AND）
  | 'choice';    // 複数ノードの選択（OR）

interface ASTNode {
  kind: NodeKind;
  id: string;    // UUID など一意識別子
}
```

### ステップ2 — Target と Qualifier を定義する

```ts
// 対象の種類
type TargetType =
  | 'monster'
  | 'spell'
  | 'trap'
  | 'player'
  | 'card'      // 種類問わず
  | 'zone';

interface TargetNode extends ASTNode {
  kind: 'target';
  targetType: TargetType;
  qualifiers: QualifierNode[];  // Targetを絞り込む修飾子の列
}

// 修飾子の種類
type QualifierType =
  | 'owner'          // 自分の / 相手の
  | 'timing'         // このターン中 / 相手のターン中
  | 'event'          // 召喚された / 破壊された
  | 'stat'           // 攻撃力〇〇以上
  | 'position'       // 表側攻撃表示 / 裏側守備表示
  | 'zone'           // フィールド上 / 手札
  | 'count';         // 〇体以上

interface QualifierNode extends ASTNode {
  kind: 'qualifier';
  qualifierType: QualifierType;
  value?: string | number;   // "opponent" / "this_turn" / 1000 など
  operator?: 'eq' | 'gte' | 'lte' | 'neq';
}
```

### ステップ3 — Condition と Effect を定義する

```ts
interface ConditionNode extends ASTNode {
  kind: 'condition';
  target: TargetNode;
  // 複合条件のために子ノードを持てる
  children?: ConditionNode[];
  logic?: 'and' | 'or';
}

type EffectType =
  | 'destroy'
  | 'draw'
  | 'search'
  | 'banish'
  | 'return_to_hand'
  | 'stat_change'
  | 'negate'
  | 'special_summon'
  | 'move';  // 追加: 移動効果

// ゾーンの種類
type ZoneType =
  | 'deck'
  | 'hand'
  | 'field'
  | 'graveyard'
  | 'banished'
  | 'extra_deck';

interface EffectNode extends ASTNode {
  kind: 'effect';
  effectType: EffectType;
  target: TargetNode;
  value?: number;   // stat_change などで使う値
  // 移動効果の場合の追加フィールド
  fromZone?: ZoneType;
  toZone?: ZoneType;
}
```

### ステップ4 — カード全体のルートノード

```ts
interface CardNode extends ASTNode {
  kind: 'card';
  name: string;
  condition: ConditionNode | null;  // 発動条件（なければ常時）
  effects: EffectNode[];            // 効果のリスト（複数可）
}
```

---

## 3. ノーコードビルダーの設計

ユーザーが自動補完で句を選んでカードを組み立てる UI を設計する。

### 状態機械（State Machine）としての入力フロー

```
[ カード開始 ]
    │
    ▼
[ 条件を設定する？ ] ──No──→ [ 効果の設定へ ]
    │ Yes
    ▼
[ Target 選択 ] → [ Qualifier 追加（0個以上）] → [ 条件完成 ]
    │
    ▼
[ 効果の設定 ]
    │
    ▼
[ EffectType 選択 ] → [ Target 選択 ] → [ Qualifier 追加 ] → [ 完成 ]
```

### 自動補完の候補生成ロジック

現在のノードの `kind` を見て、次に選べる候補を返す純粋関数として実装する。

```ts
type BuilderState = {
  current: 'idle' | 'editing_condition' | 'editing_effect' | 'done';
  partialCard: Partial<CardNode>;
};

function getNextOptions(state: BuilderState): Option[] {
  switch (state.current) {
    case 'idle':
      return [
        { label: '条件を追加する', action: 'start_condition' },
        { label: '効果を追加する', action: 'start_effect' },
      ];
    case 'editing_condition':
      return getTargetOptions().concat(getQualifierOptions());
    case 'editing_effect':
      return getEffectTypeOptions();
    default:
      return [];
  }
}
```

---

## 4. ASTのシリアライズとストレージ

ASTをそのままJSONとして保存・読み込みできる設計にする。

```ts
// 保存
const serialized: string = JSON.stringify(cardNode);

// 読み込み
const loaded: CardNode = JSON.parse(serialized) as CardNode;

// バリデーション（型ガード）
function isCardNode(node: unknown): node is CardNode {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as ASTNode).kind === 'card'
  );
}
```

データベースやファイルには JSON 文字列として保存し、ゲームエンジンは読み込み時にバリデーションをかけてから評価する。

---

## 5. ASTの評価エンジン（インタープリタ）

保存されたASTを実際に「実行」するインタープリタを実装する。

```ts
interface GameState {
  field: {
    self: CardInstance[];
    opponent: CardInstance[];
  };
  hand: { self: CardInstance[] };
  turn: 'self' | 'opponent';
  turnCount: number;
}

// 条件ノードを評価して true/false を返す
function evaluateCondition(
  node: ConditionNode,
  state: GameState
): boolean {
  const targets = resolveTarget(node.target, state);
  if (node.logic === 'and')
    return (node.children ?? []).every(c => evaluateCondition(c, state));
  if (node.logic === 'or')
    return (node.children ?? []).some(c => evaluateCondition(c, state));
  return targets.length > 0;
}

// ターゲットノードを解決して対象カードのリストを返す
function resolveTarget(
  node: TargetNode,
  state: GameState
): CardInstance[] {
  let pool = getAllCards(state, node.targetType);
  for (const q of node.qualifiers) {
    pool = applyQualifier(pool, q, state);
  }
  return pool;
}

// 効果ノードを実行してゲーム状態を更新する
function executeEffect(
  node: EffectNode,
  state: GameState
): GameState {
  const targets = resolveTarget(node.target, state);
  switch (node.effectType) {
    case 'destroy':
      return removeCards(state, targets);
    case 'draw':
      return drawCards(state, node.value ?? 1);
    case 'move':
      return moveCards(state, targets, node.fromZone, node.toZone);
    // ...他の効果
    default:
      return state;
  }
}
```

---

## 6. 実装ロードマップ

### フェーズ1 — 型定義と基本評価エンジン
- [ ] `ASTNode` / `TargetNode` / `QualifierNode` の型定義
- [ ] `ConditionNode` / `EffectNode` / `CardNode` の型定義
- [ ] `resolveTarget` の実装
- [ ] `evaluateCondition` の実装
- [ ] `executeEffect` の最小実装（destroy / draw / move のみ）

### フェーズ2 — ノーコードビルダーUI
- [ ] `BuilderState` の状態管理
- [ ] `getNextOptions` による自動補完候補の生成
- [ ] UIコンポーネントとの接続

### フェーズ3 — シリアライズ・永続化
- [ ] JSON保存・読み込みの実装
- [ ] `isCardNode` 型ガードによるバリデーション
- [ ] カードデータベースの設計（DB or ファイルベース）

### フェーズ4 — 拡張
- [ ] 複合条件（AND / OR）のサポート
- [ ] `choice` ノード（「AかBを選ぶ」効果）の実装
- [ ] 効果タイプの追加（`negate` / `special_summon` など）
- [ ] ゲームエンジンとのフル統合テスト

---

## 7. ファイル構成の提案

```
src/
├── ast/
│   ├── types.ts          # 全ノードの型定義
│   ├── validate.ts       # 型ガードとバリデーション
│   └── serialize.ts      # JSON変換ユーティリティ
├── engine/
│   ├── resolver.ts       # resolveTarget
│   ├── evaluator.ts      # evaluateCondition
│   └── executor.ts       # executeEffect
├── builder/
│   ├── state.ts          # BuilderState と遷移ロジック
│   └── options.ts        # getNextOptions（自動補完候補）
└── data/
    └── cards/            # カードJSONファイル群
```

---

## まとめ

| 要素 | 役割 |
|------|------|
| `TargetNode` | 「何が」対象かを表す |
| `QualifierNode` | 対象を絞り込む修飾子 |
| `ConditionNode` | 発動条件（Target + Qualifiers） |
| `EffectNode` | 効果の種類と対象 |
| `CardNode` | カード全体のルートノード |
| `BuilderState` | ノーコードUIの入力状態機械 |
| `evaluateCondition` | 条件の真偽判定 |
| `executeEffect` | 効果の実行とゲーム状態更新 |

この設計により、**すべてのカードテキストをデータとして表現でき**、ゲームエンジンはASTを解釈するだけで新しいカードを自動的に扱えるようになります。
