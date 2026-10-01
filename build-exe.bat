@echo off
chcp 65001 >nul
echo.
echo =====================================
echo 能源门户管理系统 - 构建 EXE
echo =====================================
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Node.js
    echo.
    echo 请先安装 Node.js 18.0.0 或更高版本
    echo 下载地址: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo.
echo 📦 构建 CMS standalone 并打包 Electron 应用...
echo.
call npm run electron-build
if errorlevel 1 (
    echo ❌ Electron 打包失败
    pause
    exit /b 1
)

echo.
echo ✅ 打包完成！
echo.
echo 📁 生成的文件位置: dist\
echo.
echo 生成文件: dist\EnergyPortalManager.exe (便携版)
echo.
echo 双击后直接进入 CMS，门户构建与发布位于窗口菜单。
echo.

pause
