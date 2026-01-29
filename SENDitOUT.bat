@echo off
:: This script builds, commits, pushes, and plays a success sound.

echo ---------------------------------------------------
echo 1. BUILDING THE DAMN SITE...
echo ---------------------------------------------------
call npm run build

:: If the build fails, stop everything so you don't push garbage.
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed. Fix your shit and try again.
    pause
    exit /b
)



echo.
echo ---------------------------------------------------
echo 2. STAGING FILES...
echo ---------------------------------------------------
git add .

echo.
echo ---------------------------------------------------
echo 3. COMMITTING...
echo ---------------------------------------------------
:: This asks you to type a message right in the window.
set /p commitMsg="Enter your commit message: "
git commit -m "%commitMsg%"

echo.
echo ---------------------------------------------------
echo 4. DEPLOYING TO GITHUB PAGES...
echo ---------------------------------------------------
call npm run deploy

echo.
echo ---------------------------------------------------
echo 5. PUSHING TO GITHUB...
echo ---------------------------------------------------
git push origin main

echo.
echo ---------------------------------------------------
echo SUCCESS. 
echo ---------------------------------------------------


pause