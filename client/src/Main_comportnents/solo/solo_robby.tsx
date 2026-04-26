import {default as Go_top} from "../../Oth_compornents/go_top"
import { useNavigate } from 'react-router-dom';

export default function Solo() {
    const navigate = useNavigate();

    return(
        <>
            <p>これはソロモードです。</p>
            <button onClick={() => navigate("/game")}>デュエル開始</button>
            <button>デッキ編集</button>
            <Go_top />
        </>
    )
}