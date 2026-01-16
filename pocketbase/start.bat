@echo off
REM PocketBase 启动脚本

echo ========================================
echo   PocketBase 后台管理系统
echo ========================================
echo.

REM 检查 PocketBase 可执行文件是否存在
if not exist "pocketbase.exe" (
    echo [错误] 未找到 pocketbase.exe 可执行文件
    echo.
    echo 请从 https://github.com/pocketbase/pocketbase/releases 下载最新版本
    echo 并将 pocketbase.exe 放到当前目录
    echo.
    pause
    exit /b 1
)

echo [信息] 启动 PocketBase 服务器...
echo [信息] 管理后台: http://localhost:8090/_/
echo [信息] API 地址: http://localhost:8090/api/
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动 PocketBase
pocketbase.exe serve

pause