@echo off
chcp 65001 >nul
echo ========================================
echo   同步文件到GitHub Desktop
echo ========================================
echo.

setlocal
set "source=E:\wangzhan"
set "dest=E:\Github\wangzhan"

echo [1] 开始同步文件...
echo.

echo [2] 复制 admin.html...
copy /Y "%source%\admin.html" "%dest%\admin.html"
if errorlevel 1 (
    echo [ERROR] 复制 admin.html 失败
    goto :error
)

echo [3] 复制 index.html...
copy /Y "%source%\index.html" "%dest%\index.html"
if errorlevel 1 (
    echo [ERROR] 复制 index.html 失败
    goto :error
)

echo [4] 复制 tools-upload.html...
copy /Y "%source%\tools-upload.html" "%dest%\tools-upload.html"
if errorlevel 1 (
    echo [ERROR] 复制 tools-upload.html 失败
    goto :error
)

echo [5] 复制 projects-upload.html...
copy /Y "%source%\projects-upload.html" "%dest%\projects-upload.html"
if errorlevel 1 (
    echo [ERROR] 复制 projects-upload.html 失败
    goto :error
)

echo [6] 复制 css/style.css...
copy /Y "%source%\css\style.css" "%dest%\css\style.css"
if errorlevel 1 (
    echo [ERROR] 复制 css/style.css 失败
    goto :error
)

echo [7] 复制 js/main.js...
copy /Y "%source%\js\main.js" "%dest%\js\main.js"
if errorlevel 1 (
    echo [ERROR] 复制 js/main.js 失败
    goto :error
)

echo [8] 复制 images/hero.jpg...
copy /Y "%source%\images\hero.jpg" "%dest%\images\hero.jpg"
if errorlevel 1 (
    echo [ERROR] 复制 images/hero.jpg 失败
    goto :error
)

echo [9] 复制 images/profile.jpg...
copy /Y "%source%\images\profile.jpg" "%dest%\images\profile.jpg"
if errorlevel 1 (
    echo [ERROR] 复制 images/profile.jpg 失败
    goto :error
)

echo.
echo ========================================
echo   同步完成！
echo ========================================
echo.
echo [10] 文件已同步到 GitHub Desktop 仓库
echo [11] GitHub Desktop 会自动检测并推送到GitHub
echo.
echo ========================================
echo.
echo 按任意键退出...
pause >nul

:error
echo.
echo ========================================
echo   同步失败！
echo ========================================
echo.
echo 请检查文件路径和权限
echo.
pause
endlocal