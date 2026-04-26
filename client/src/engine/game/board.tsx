// src/ui/Board.tsx

// import type { G } from '../../../../server/src/game_engine/types' ここを確認してGを設定する事！
// TODO: G型の定義が必要です
type G = any; // 仮の型定義

type Props = {
  G: G;
  ctx: any;
  moves: any;
  playerID?: string;
};

export function Board({ G, moves, playerID }: Props) {
  if (!playerID) {
    return <div>観戦中</div>;
  }

  const my = G.players[playerID];
  const opponentID = Object.keys(G.players).find(id => id !== playerID)!;
  const opponent = G.players[opponentID];

  return (
    <div className="board">
      {/* 相手エリア */}
      <section className="opponent">
        <div className="opponent-hand">
          <p>手札: {opponent.hand.length}</p>
        </div>
        <div className="side-zones">
          <div className="deck">
            <p>デッキ: {opponent.deck.length}</p>
          </div>
          <div className="shield">
            <p>シールド: {opponent.shieldZone.length}</p>
            <button onClick={() => moves.movebreakShield(opponentID)}>
              シールド破壊
            </button>
          </div>
          <div className="grave">
            <p>墓地: {opponent.graveyard.length}</p>
          </div>
        </div>
      </section>

      {/* フィールド */}
      <section className="field">
        <div className="field-opponent">
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
        </div>

        <div className="field-player">
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
          <div className="card-slot"></div>
        </div>
      </section>

      {/* 自分エリア */}
      <section className="player">
        <div className="side-zones">
          <div className="deck">
            <p>デッキ: {my.deck.length}</p>
            <button onClick={() => moves.moveDrawCard(playerID)}>
              1枚ドロー
            </button>
          </div>
          <div className="shield">
            <p>シールド: {my.shieldZone.length}</p>
          </div>
          <div className="grave">
            <p>墓地: {my.graveyard.length}</p>
          </div>
        </div>
        <div className="player-hand">
          <p>手札: {my.hand.length}</p>
        </div>
      </section>
    </div>
  );
}