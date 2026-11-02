@echo off
chcp 65001 > nul
title تحديث ورفع المنظومة الموحدة إلى GitHub
cd /d "%~dp0"

echo ========================================================
echo   المنظومة الرقمية الشاملة لأستاذ مادة الرياضيات
echo   تحديث ورفع التغييرات إلى مستودع GitHub
echo   المستودع: ACHAMEL-FI-RIADIAT
echo ========================================================
echo.

set "GIT_PATH=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
if not exist "%GIT_PATH%" (
    where git >nul 2>nul
    if %errorlevel% equ 0 (
        set "GIT_PATH=git"
    ) else (
        echo [خطأ] لم يتم العثور على أداة Git.
        pause
        exit /b 1
    )
)

echo [1/3] فحص وإضافة الملفات المعدلة...
"%GIT_PATH%" add .

echo [2/3] إنشاء نقطة الحفظ (Commit)...
set /p commitMsg="أدخل وصف التعديل (أو اضغط Enter لاعتماد الوصف الافتراضي): "
if "%commitMsg%"=="" set "commitMsg=تحديث المنظومة الموحدة للرياضيات"
"%GIT_PATH%" commit -m "%commitMsg%"

echo.
echo [3/3] رفع التغييرات إلى GitHub (origin/main)...
"%GIT_PATH%" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [تنبيه] إذا طُلب منك تسجيل الدخول، أدخل حساب GitHub أو Personal Access Token (PAT).
    echo.
) else (
    echo.
    echo ========================================================
    echo  [نجاح] تم رفع جميع التغييرات بنجاح إلى مستودع GitHub!
    echo  الرابط: https://github.com/brahimkouziber87-cell/ACHAMEL-FI-RIADIAT
    echo ========================================================
)

echo.
pause
