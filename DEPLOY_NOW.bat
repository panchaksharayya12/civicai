@echo off
title CivicAI - GitHub Push + Vercel Deploy
color 0A
echo.
echo ==========================================
echo   CivicAI - GitHub Push + Vercel Deploy
echo   Team: Panchaksharayya & Rashmi
echo ==========================================
echo.

cd /d "c:\Users\panch\Downloads\CivicAI — Smart Public Issue Resolution"

echo [1/3] Pushing to GitHub...
echo      (A browser/dialog may pop up to sign in to GitHub - allow it)
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo ERROR: GitHub push failed. 
    echo Try: git remote set-url origin https://YOUR_TOKEN@github.com/panchaksharayya12/civicai.git
    echo Then run this script again.
) else (
    echo.
    echo GitHub push DONE!
)

echo.
echo [2/3] Logging into Vercel...
echo      (Browser will open - sign in with your Vercel/GitHub account)
echo.
vercel login

echo.
echo [3/3] Deploying to Vercel (production)...
vercel --prod --yes

echo.
echo ==========================================
echo   ALL DONE!
echo   Your site is live on Vercel!
echo   Check the URL printed above.
echo ==========================================
echo.
pause
