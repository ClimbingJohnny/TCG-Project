import {default as Go_top} from "../../Oth_compornents/go_top"
import { useNavigate } from 'react-router-dom';

function Deckmake() {
    const navigate = useNavigate();

    return(
        <div className="w-full flex flex-col items-center flex-1 p-4">
            <h1 className="text-3xl font-bold mb-6">デッキ編集</h1>
        <div id="Deck_port" className="w-full bg-black border-2 border-white flex overflow-x-auto overflow-y-auto max-h-96">
            <div className="h-full grid gap-4" style={{gridAutoFlow: 'column', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gridAutoColumns: 'minmax(30vw, 1fr)'}}>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">デッキ一覧</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">デッキ一覧</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            <p className="bg-white/40 border-2 border-cyan-300 rounded m-[5%]">テスト</p>
            </div>
        </div>
        <div className="w-full flex flex-wrap gap-4 justify-center my-8">
            <button type="button" className="bg-blue-500 text-white px-8 py-3 rounded font-semibold shadow-md transition-all hover:bg-blue-600 hover:shadow-lg active:translate-y-0.5">デッキの新規作成</button>
            <button type="button" onClick={() => navigate('/newcardmake')} className="bg-green-500 text-white px-8 py-3 rounded font-semibold shadow-md transition-all hover:bg-green-600 hover:shadow-lg active:translate-y-0.5">カードの新規作成</button>
        </div>
        <div className="mt-8">
            <Go_top />
        </div>
    </div>
    )
}

export default Deckmake;