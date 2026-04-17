@echo off
echo ========================================
echo   BLOG DEPLOY SYSTEM (Power Mode)
echo ========================================

:: Set 1GB Buffer
git config http.postBuffer 1048576000

:: Force SOCKS5 Proxy for V2Ray (Assuming port 10808)
:: If your port is 1080, please change it manually in this file.
git config http.proxy socks5://127.0.0.1:10808
git config https.proxy socks5://127.0.0.1:10808

echo [1/3] Adding changes...
git add .

echo [2/3] Committing changes...
git commit -m "Update blog assets"

echo [3/3] Pushing...
git push origin main --progress

:: Clean up proxy after push
git config --unset http.proxy
git config --unset https.proxy

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Still failed. Try Global Mode in V2Ray.
) else (
    echo.
    echo SUCCESS: Blog is live!
)

pause
