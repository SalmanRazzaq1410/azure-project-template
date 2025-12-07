# ============================================================================
# Add Implementation Files to azure-project-template
# ============================================================================
# Run from: C:\Users\smitj\repos\azure-project-template
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "🔧 Adding implementation files..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

if (-not (Test-Path "README.md")) {
    Write-Host "❌ Error: Not in azure-project-template" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Location verified" -ForegroundColor Green

# ============================================================================
# Infrastructure
# ============================================================================
Write-Host "`n📝 Creating infrastructure..." -ForegroundColor Yellow

.\scripts\create-infra.ps1
.\scripts\create-api-hexagonal.ps1
.\scripts\create-gitignore.ps1

# ============================================================================
# Commit
# ============================================================================
Write-Host "`n📤 Committing..." -ForegroundColor Yellow

git add .
git commit -m "Add complete implementations"
git push

Write-Host "`n✅ Complete!" -ForegroundColor Green
Write-Host "📍 https://github.com/phoenixvc/azure-project-template" -ForegroundColor Cyan
