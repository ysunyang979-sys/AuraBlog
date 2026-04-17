@echo off
echo ========================================
echo   BLOG DEPLOY SYSTEM (SSH MODE)
echo ========================================
echo.

:: Note: Ensure you have run: 
:: git remote set-url origin git@github.com-ysunyang979-sys:ysunyang979-sys/[YOUR_REPO].git

echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes...
git commit -m "Deploy via SSH"

echo [3/3] Pushing to GitHub...
:: Using SSH which is more resilient to large 241MB payloads
git push origin main --progress

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Push failed. 
    echo Please make sure your remote URL is set to an SSH alias from your config.
) else (
    echo.
    echo SUCCESS: Your blog is now live via SSH!
)

pause
