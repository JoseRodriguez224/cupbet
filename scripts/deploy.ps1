# Run from project folder: npm run deploy

Write-Host "Building site..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deploy started!" -ForegroundColor Green
Write-Host "1. Wait 1-2 minutes for GitHub Actions"
Write-Host "2. Open: https://joserodriguez224.github.io/betting-site/"
Write-Host "3. Hard refresh: Ctrl + Shift + R"
Write-Host ""
