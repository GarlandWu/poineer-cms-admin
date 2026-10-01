@echo off
chcp 65001 >nul
echo.
echo =====================================
echo 能源门户管理系统 - 开发模式
echo =====================================
echo.
echo ⏳ 正在启动应用...
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

REM 启动开发环境
echo ✅ 启动开发环境...
echo.
echo 📝 CMS 将在 http://localhost:3001 运行
echo 🌐 预览将在 http://localhost:5000 运行
echo 💻 UI 开发服务器在 http://localhost:3000 运行
echo.
call npm run electron-dev

pause
