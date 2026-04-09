@echo off
echo ========================================
echo   🚀 AuraBlog One-Click Deploy System
echo ========================================
echo.
echo [1/3] Adding changes...
git add .
echo.
echo [2/3] Committing changes...
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg="Update blog content and styles"
git commit -m "%msg%"
echo.
echo [3/3] Pushing to GitHub/Vercel...
git push origin main
echo.
echo ========================================
echo   ✅ SUCCESS: Blog is now live!
echo ========================================
pause
