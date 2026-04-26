# TCG Project - 開発環境起動スクリプト
# 使用方法: .\run-dev.ps1

Write-Host "================================" -ForegroundColor Cyan
Write-Host "TCG Project - 開発環境起動" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Node.js が インストールされているか確認
Write-Host "Node.js バージョン確認..." -ForegroundColor Yellow
node --version
Write-Host ""

# npm が インストールされているか確認
Write-Host "npm バージョン確認..." -ForegroundColor Yellow
npm --version
Write-Host ""

# concurrently がインストールされているか確認
Write-Host "依存関係を確認中..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules/concurrently")) {
    Write-Host "concurrently がインストールされていません。インストール中..." -ForegroundColor Yellow
    npm install
}
Write-Host ""

# Client と Server を同時起動
Write-Host "Client と Server を起動中..." -ForegroundColor Green
Write-Host "  - Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Server: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

npm run dev

# Ctrl+Cで終了時のメッセージ
Write-Host ""
Write-Host "開発環境を終了しました。" -ForegroundColor Green
