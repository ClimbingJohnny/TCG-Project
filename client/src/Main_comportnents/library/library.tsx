import {default as Go_top} from "../../Oth_compornents/go_top"

export default function Library() {
    return(
        <>
            <p>これはライブラリです。</p>
            <form id="lib-search">
                <fieldset>
                    <legend>検索</legend>
                    <input type="text" ></input>
                    <input type="button" value="詳細"></input>
                    <input type="SUBMIT"></input>
                </fieldset>
            </form>
            <div className="border-2 border-white top-2.5 bottom-2.5">
                <p>これはメインのライブラリです。</p>
            </div>
            <Go_top />
        </>)
}