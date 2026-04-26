import {default as Go_top} from "../../Oth_compornents/go_top"

export default function Duel() {
    return(
        <>
            <p>これはデュエルモードです。</p>
            <button onClick={() => console.log("デュエル開始")}>デュエル開始</button>
            <Go_top />
        </>
    )
}