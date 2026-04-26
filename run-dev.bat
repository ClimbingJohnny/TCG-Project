@echo off
REM TCG Project - 開発環境起動スクリプト (Windows Batch)
REM 使用方法: run-dev.bat をダブルクリック、または cmd で実行

chcp 65001 > nul
cls

echo ================================
echo TCG Project - 開発環境起動
echo ================================
echo.

REM Node.js が インストールされているか確認
echo Node.js バージョン確認...
node --version
echo.

REM npm が インストールされているか確認
echo npm バージョン確認...
npm --version
echo.

REM concurrently がインストールされているか確認
echo 依存関係を確認中...
if not exist "node_modules\concurrently" (
    echo concurrently がインストールされていません。インストール中...
    call npm install
)
echo.

REM Client と Server を同時起動
echo Client と Server を起動中...
echo   - Client: http://localhost:5173
echo   - Server: http://localhost:3000
echo.

call npm run dev

echo.
echo 開発環境を終了しました。
pause
