import { useState } from "react";
import { default as Go_top } from "../../Oth_compornents/go_top"
import { Board } from "../../engine/game/board";

export default function Solo() {
    const [showBoard, setShowBoard] = useState(false);

    // ダミーゲーム状態（実際のゲーム状態に置き換えてください）
    const dummyGameState = {
        players: {
            "0": { hand: [], shieldZone: [] },
            "1": { hand: [], shieldZone: [] }
        }
    };

    const dummyMoves = {
        breakShield: (opponentID: string) => {
            console.log(`Shield broken for ${opponentID}`);
        }
    };

    if (showBoard) {
        return (
            <>
                <Board G={dummyGameState} ctx={{}} moves={dummyMoves} playerID="0" />
                <button onClick={() => setShowBoard(false)}>戻る</button>
            </>
        );
    }

    return (
        <>
            <p>これはソロモードです。</p>
            <button onClick={() => setShowBoard(true)}>ボード画面を表示</button>
            <Go_top />
        </>
    );
}