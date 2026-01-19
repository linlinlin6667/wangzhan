@echo off
chcp 65001 >nul
echo ========================================
echo   自动化同步脚本
echo ========================================
echo.
echo [1] 开始同步文件...
echo.

setlocal
set "localRepo=E:\wangzhan"
set "githubRepo=E:\Github\wangzhan"

echo [2] 复制 admin.html...
copy /Y "%localRepo%\admin.html" "%githubRepo%\admin.html"
if errorlevel 1 (
    echo [ERROR] 复制 admin.html 失败
    goto :error
)

echo [3] 复制 index.html...
copy /Y "%localRepo%\index.html" "%githubRepo%\index.html"
if errorlevel 1 (
    echo [ERROR] 复制 index.html 失败
    goto :error
)

echo [4] 复制 tools-upload.html...
copy /Y "%localRepo%\tools-upload.html" "%githubRepo%\tools-upload.html"
if errorlevel 1 (
    echo [ERROR] 复制 tools-upload.html 失败
    goto :error
)

echo [5] 复制 projects-upload.html...
copy /Y "%localRepo%\projects-upload.html" "%githubRepo%\projects-upload.html"
if errorlevel 1 (
    echo [ERROR] 复制 projects-upload.html 失败
    goto :error
)

echo [6] 复制 css/style.css...
copy /Y "%localRepo%\css\style.css" "%githubRepo%\css\style.css"
if errorlevel 1 (
    echo [ERROR] 复制 css/style.css 失败
    goto :error
)

echo [7] 复制 js/main.js...
copy /Y "%localRepo%\js\main.js" "%githubRepo%\js\main.js"
if errorlevel 1 (
    echo [ERROR] 复制 js/main.js 失败
    goto :error
)

echo [8] 复制 images/hero.jpg...
copy /Y "%localRepo%\images\hero.jpg" "%githubRepo%\images\hero.jpg"
if errorlevel 1 (
    echo [ERROR] 复制 images/hero.jpg 失败
    goto :error
)

echo [9] 复制 images/profile.jpg...
copy /Y "%localRepo%\images\profile.jpg" "%githubRepo%\images\profile.jpg"
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
echo [11] 请在 GitHub Desktop 中手动推送更改
echo.
echo ========================================
echo.
pause

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