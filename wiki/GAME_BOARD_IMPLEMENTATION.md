# ゲーム盤面の実装パターン

## 概要

ゲーム盤面は複数のスロット（カード配置可能な場所）で構成されており、常にすべてのスロットにカードがあるわけではない。このドキュメントでは、効果条件を組み合わせるシステムに基づいた盤面の実装パターンを提案する。

---

## パターン1: Slot ベースの状態管理（推奨）

**特徴**: 各スロットをオブジェクトとして管理し、カードが存在するかを追跡

### データ構造

```typescript
// types/board.ts
export interface BoardSlot {
  id: string; // "field_0", "hand_0" など
  type: 'field' | 'hand' | 'graveyard' | 'deck';
  position: number; // スロット内での位置
  cardId?: string; // カードがない場合は undefined
  card?: Card; // 詳細情報（必要に応じて）
}

export interface BoardState {
  slots: Map<string, BoardSlot>;
  activeEffects: Effect[]; // 適用中の効果
  conditions: GameCondition[]; // 発動可能な条件
}

export interface GameCondition {
  id: string;
  type: 'trigger' | 'continuous';
  triggers: string[]; // 発動条件: "card_placed", "turn_start" など
  targetSlot?: string; // 特定スロット対象の場合
  effect: CardEffect;
}

export interface CardEffect {
  action: string; // "draw", "damage", "summon" など
  target: string; // スロット ID または "opponent"
  value?: number; // ダメージ量、ドロー枚数など
  conditions?: string[]; // 発動条件（複数条件AND結合）
}
```

### 実装例

```typescript
// services/boardService.ts
class BoardService {
  private boardState: BoardState;

  // スロット初期化
  initializeBoard(): void {
    const slots = new Map<string, BoardSlot>();
    
    // フィールドスロット（例: 5個）
    for (let i = 0; i < 5; i++) {
      slots.set(`field_${i}`, {
        id: `field_${i}`,
        type: 'field',
        position: i,
        cardId: undefined,
      });
    }

    // 手札スロット（例: 10個）
    for (let i = 0; i < 10; i++) {
      slots.set(`hand_${i}`, {
        id: `hand_${i}`,
        type: 'hand',
        position: i,
        cardId: undefined,
      });
    }

    this.boardState = {
      slots,
      activeEffects: [],
      conditions: [],
    };
  }

  // カードを配置
  placeCard(slotId: string, cardId: string, card: Card): void {
    const slot = this.boardState.slots.get(slotId);
    if (slot) {
      slot.cardId = cardId;
      slot.card = card;
      
      // カード配置トリガーイベント
      this.triggerEvent('card_placed', { slotId, cardId });
    }
  }

  // カードを移動
  moveCard(fromSlotId: string, toSlotId: string): void {
    const fromSlot = this.boardState.slots.get(fromSlotId);
    const toSlot = this.boardState.slots.get(toSlotId);

    if (fromSlot?.cardId && !toSlot?.cardId) {
      toSlot!.cardId = fromSlot.cardId;
      toSlot!.card = fromSlot.card;
      fromSlot.cardId = undefined;
      fromSlot.card = undefined;

      this.triggerEvent('card_moved', { from: fromSlotId, to: toSlotId });
    }
  }

  // スロットの状態を取得
  getSlotState(slotId: string): BoardSlot | undefined {
    return this.boardState.slots.get(slotId);
  }

  // すべてのスロットを取得
  getAllSlots(): BoardSlot[] {
    return Array.from(this.boardState.slots.values());
  }

  // 空きスロットを取得
  getEmptySlots(type: 'field' | 'hand' | 'graveyard' | 'deck'): BoardSlot[] {
    return Array.from(this.boardState.slots.values())
      .filter(slot => slot.type === type && !slot.cardId);
  }

  // イベント処理（効果トリガー）
  private triggerEvent(eventType: string, data: any): void {
    const matchingConditions = this.boardState.conditions.filter(
      condition => condition.triggers.includes(eventType)
    );

    for (const condition of matchingConditions) {
      if (this.checkConditionMet(condition, data)) {
        this.applyEffect(condition.effect);
      }
    }
  }

  // 条件をチェック
  private checkConditionMet(condition: GameCondition, data: any): boolean {
    // カスタムロジック: 複数条件の AND/OR 判定
    if (condition.targetSlot) {
      return data.slotId === condition.targetSlot;
    }
    return true;
  }

  // 効果を適用
  private applyEffect(effect: CardEffect): void {
    const slot = this.boardState.slots.get(effect.target);
    
    switch (effect.action) {
      case 'draw':
        this.draw(effect.value || 1);
        break;
      case 'damage':
        this.dealDamage(effect.target, effect.value || 0);
        break;
      case 'summon':
        if (slot && !slot.cardId) {
          // カード生成・配置ロジック
        }
        break;
    }
  }

  private draw(count: number): void {
    // ドロー実装
  }

  private dealDamage(target: string, damage: number): void {
    // ダメージ実装
  }
}
```

---

## パターン2: Grid ベースのボード（2D配列）

**特徴**: ボードを2D格子として管理、将棋盤やチェス盤のような場合に最適

### データ構造

```typescript
// types/gridBoard.ts
export interface GridCell {
  x: number;
  y: number;
  cardId?: string;
  card?: Card;
  terrain?: string; // 地形属性など
  isWalkable: boolean;
}

export interface GridBoard {
  width: number;
  height: number;
  grid: GridCell[][];
  metadata: {
    playerSide: 'top' | 'bottom';
    fieldZoneY: number[];
  };
}
```

### 実装例

```typescript
// services/gridBoardService.ts
class GridBoardService {
  private board: GridBoard;

  initializeBoard(width: number, height: number): void {
    this.board = {
      width,
      height,
      grid: Array(height)
        .fill(null)
        .map((_, y) =>
          Array(width)
            .fill(null)
            .map((_, x) => ({
              x,
              y,
              isWalkable: true,
            }))
        ),
      metadata: {
        playerSide: 'bottom',
        fieldZoneY: [3, 4, 5],
      },
    };
  }

  // 座標からカードを取得
  getCardAt(x: number, y: number): Card | undefined {
    if (this.isValidPosition(x, y)) {
      return this.board.grid[y][x].card;
    }
    return undefined;
  }

  // カードを配置
  placeCardAt(x: number, y: number, card: Card): boolean {
    if (
      this.isValidPosition(x, y) &&
      !this.board.grid[y][x].cardId &&
      this.board.grid[y][x].isWalkable
    ) {
      this.board.grid[y][x].card = card;
      this.board.grid[y][x].cardId = card.id;
      return true;
    }
    return false;
  }

  // カードを移動
  moveCard(fromX: number, fromY: number, toX: number, toY: number): boolean {
    if (!this.isValidPosition(fromX, fromY) || !this.isValidPosition(toX, toY)) {
      return false;
    }

    const fromCell = this.board.grid[fromY][fromX];
    const toCell = this.board.grid[toY][toX];

    if (fromCell.card && !toCell.card && toCell.isWalkable) {
      toCell.card = fromCell.card;
      toCell.cardId = fromCell.cardId;
      fromCell.card = undefined;
      fromCell.cardId = undefined;
      return true;
    }
    return false;
  }

  // フィールドゾーン内の空きセルを取得
  getAvailableFieldCells(): GridCell[] {
    return this.board.grid
      .flatMap((row, y) =>
        row.filter((cell, x) =>
          this.board.metadata.fieldZoneY.includes(y) &&
          !cell.cardId &&
          cell.isWalkable
        )
      );
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.board.width && y >= 0 && y < this.board.height;
  }
}
```

---

## パターン3: 複合アプローチ（複数ゾーン管理）

**特徴**: 異なるゾーン（フィールド、手札、墓地）ごとに最適な管理方式を選択

```typescript
// types/hybridBoard.ts
export interface HybridBoardState {
  field: GridBoard; // フィールドはグリッドで管理
  hand: BoardSlot[]; // 手札はスロット配列で管理
  graveyard: Card[]; // 墓地はシンプルな配列
  deck: Card[];
  activeZone: 'field' | 'hand' | 'graveyard' | 'deck';
}

// services/hybridBoardService.ts
class HybridBoardService {
  private boardState: HybridBoardState;

  // 各ゾーンのサービス
  private fieldService: GridBoardService;
  private handService: BoardSlotService;

  initializeBoard(): void {
    this.fieldService = new GridBoardService();
    this.fieldService.initializeBoard(5, 5);

    this.handService = new BoardSlotService();
    this.handService.initializeSlots('hand', 10);

    this.boardState = {
      field: this.fieldService.getBoard(),
      hand: this.handService.getSlots(),
      graveyard: [],
      deck: [],
      activeZone: 'field',
    };
  }

  // ゾーン間でのカード移動
  moveCardBetweenZones(
    fromZone: string,
    toZone: string,
    cardId: string
  ): boolean {
    // ゾーンごとのロジック
    const card = this.removeCardFromZone(fromZone, cardId);
    if (card) {
      return this.addCardToZone(toZone, card);
    }
    return false;
  }

  private removeCardFromZone(zone: string, cardId: string): Card | null {
    switch (zone) {
      case 'field':
        return this.fieldService.removeCardById(cardId);
      case 'hand':
        return this.handService.removeCardById(cardId);
      case 'graveyard':
        const graveyardIndex = this.boardState.graveyard.findIndex(
          c => c.id === cardId
        );
        if (graveyardIndex !== -1) {
          return this.boardState.graveyard.splice(graveyardIndex, 1)[0];
        }
        break;
    }
    return null;
  }

  private addCardToZone(zone: string, card: Card): boolean {
    switch (zone) {
      case 'graveyard':
        this.boardState.graveyard.push(card);
        return true;
      case 'deck':
        this.boardState.deck.unshift(card); // デッキトップに追加
        return true;
    }
    return false;
  }
}
```

---

## パターン4: イベントドリブン型（Effect System との統合）

**特徴**: ゲーム状態変更をイベントとして扱い、効果システムと統合

```typescript
// types/eventBoard.ts
export interface BoardEvent {
  type:
    | 'card_placed'
    | 'card_removed'
    | 'card_moved'
    | 'turn_start'
    | 'turn_end';
  timestamp: number;
  data: Record<string, any>;
  sourceCard?: Card;
  targetCard?: Card;
}

export interface EffectListener {
  condition: (event: BoardEvent) => boolean; // イベントをフィルタ
  handler: (event: BoardEvent) => void; // 処理実行
}

// services/eventDrivenBoardService.ts
class EventDrivenBoardService extends EventEmitter {
  private listeners: EffectListener[] = [];
  private boardState: BoardState;

  // 効果リスナーを登録
  registerEffectListener(listener: EffectListener): void {
    this.listeners.push(listener);
  }

  // イベント発生
  placeCard(slotId: string, card: Card): void {
    const slot = this.boardState.slots.get(slotId);
    if (slot) {
      slot.cardId = card.id;
      slot.card = card;

      const event: BoardEvent = {
        type: 'card_placed',
        timestamp: Date.now(),
        data: { slotId, card },
        sourceCard: card,
      };

      this.emitBoardEvent(event);
    }
  }

  // イベント処理とリスナー実行
  private emitBoardEvent(event: BoardEvent): void {
    for (const listener of this.listeners) {
      if (listener.condition(event)) {
        listener.handler(event);
      }
    }
  }
}
```

---

## 推奨される実装戦略

### 1. **小規模・シンプルゲーム** → **パターン1（Slot ベース）**
- 実装が簡潔
- フィールドサイズが固定
- スロット数が限られている

### 2. **グリッドベース（チェス盤など）** → **パターン2（Grid ベース）**
- 大規模ボード
- 移動範囲の計算が必要
- 地形やポジション判定が重要

### 3. **複雑なゲーム（複数ゾーン）** → **パターン3（複合型）**
- フィールド、手札、墓地など複数ゾーン
- ゾーンごとに異なる管理方式
- ドラッグ&ドロップで異なるUI操作

### 4. **高度な効果システム** → **パターン4（イベントドリブン）**
- 複雑な条件判定
- 複数カードの相互作用
- ケーム状態の追跡が必須

---

## React コンポーネント例

### Slot ベースの盤面表示

```typescript
// components/GameBoard.tsx
import React, { useState, useEffect } from 'react';
import { BoardSlot } from '../types/board';
import { BoardService } from '../services/boardService';

interface GameBoardProps {
  boardService: BoardService;
}

const GameBoard: React.FC<GameBoardProps> = ({ boardService }) => {
  const [slots, setSlots] = useState<BoardSlot[]>([]);

  useEffect(() => {
    setSlots(boardService.getAllSlots());
  }, [boardService]);

  const handleCardPlace = (slotId: string) => {
    // カード配置ロジック
  };

  return (
    <div className="game-board">
      <div className="field-zone">
        {slots
          .filter(slot => slot.type === 'field')
          .map(slot => (
            <div
              key={slot.id}
              className="board-slot"
              onClick={() => handleCardPlace(slot.id)}
            >
              {slot.card ? (
                <div className="card">{slot.card.name}</div>
              ) : (
                <div className="empty-slot">Empty</div>
              )}
            </div>
          ))}
      </div>

      <div className="hand-zone">
        {slots
          .filter(slot => slot.type === 'hand')
          .map(slot => (
            <div key={slot.id} className="hand-slot">
              {slot.card && <div className="card">{slot.card.name}</div>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default GameBoard;
```

### Grid ベースの盤面表示

```typescript
// components/GridBoard.tsx
const GridBoard: React.FC<{ board: GridBoard }> = ({ board }) => {
  return (
    <div className="grid-board">
      {board.grid.map((row, y) => (
        <div key={y} className="grid-row">
          {row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`grid-cell ${cell.isWalkable ? 'walkable' : 'blocked'}`}
              style={{
                backgroundColor: board.metadata.fieldZoneY.includes(y)
                  ? '#f0f0f0'
                  : '#fff',
              }}
            >
              {cell.card && <div className="card">{cell.card.name}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridBoard;
```

---

## ベストプラクティス

1. **状態管理の一元化**: Redux や Zustand を使用
2. **効果の遅延実行**: 非同期で複数の効果を順番に処理
3. **テスト性の確保**: ビジネスロジックと UI を分離
4. **パフォーマンス最適化**: 大量のスロット時は仮想化（virtualization）を検討
5. **拡張性**: 新しいゾーンタイプやスロットタイプを追加しやすい構造に

---

## 参考リンク

- [PRISMA_SETUP.md](PRISMA_SETUP.md) - データベーススキーマ
- [card_game_ast_design.md](card_game_ast_design.md) - カードゲーム設計
- [REACT_ROUTER_EXPLANATION.md](REACT_ROUTER_EXPLANATION.md) - ルーティング構造
