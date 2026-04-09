@echo off
echo ========================================
echo   BLOG DEPLOY SYSTEM
echo ========================================
echo.
echo [1/3] Adding changes...
git add .
echo.
echo [2/3] Committing changes...
set /p msg="Enter commit message: "
if "%msg%"=="" set msg="Update blog"
git commit -m "%msg%"
echo.
echo [3/3] Pushing to GitHub...
git push origin main
echo.
echo ========================================
echo   COMPLETE: Your blog is now live!
echo ========================================
pause
