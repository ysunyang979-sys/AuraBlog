@echo off
echo ========================================
echo   BLOG DEPLOY SYSTEM
echo ========================================
echo.

:: Optimize for 241MB push
git config http.postBuffer 524288000

echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes...
git commit -m "Auto deploy"

echo [3/3] Pushing to GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed. Check V2Ray.
) else (
    echo.
    echo SUCCESS: Blog is live!
)

pause
