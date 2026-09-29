# GCVIAS Production Cloud Deployment Script
# Automatically builds and deploys to 24/7 independent cloud hosting with custom domain support

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "GCVIAS: 24/7 INDEPENDENT CENTRAL SERVER DEPLOYMENT UTILITY" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Step 1: Execute Production Build
Write-Host "`n[1/3] Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please resolve errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "Production bundle compiled successfully." -ForegroundColor Green

# Step 2: Deploy to Vercel Cloud Edge
Write-Host "`n[2/3] Launching independent 24/7 cloud instance via Vercel Edge..." -ForegroundColor Yellow
Write-Host "If prompted, authenticate in your browser to link your cloud project." -ForegroundColor DarkCyan

npx vercel --prod

# Step 3: Custom Domain Instructions
Write-Host "`n[3/3] Central deployment complete." -ForegroundColor Green
Write-Host "Your system is now hosted on global edge servers 24/7." -ForegroundColor White
Write-Host "It will remain accessible from mobile phones, tablets, and remote PCs even if this local machine is powered down." -ForegroundColor White
Write-Host "`nTo bind your custom domain:" -ForegroundColor Yellow
Write-Host "1. Open your Vercel project dashboard at https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Navigate to Settings -> Domains and add your custom domain." -ForegroundColor White
Write-Host "3. Add a CNAME DNS record pointing your domain to: cname.vercel-dns.com" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
