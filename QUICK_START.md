# 能源门户管理工具 - 快速开始

## 📦 一分钟打包 EXE

### 第一次（需要安装 pkg）

```bash
# 全局安装打包工具
npm install -g pkg

# 或直接运行（脚本会自动检查）
npm run pkg
```

### 后续更新

```bash
npm run pkg
```

**等待 3-5 分钟，完成后会看到：**

```
✅ 打包完成！

📍 EXE 文件位置: c:\pioneerCMS\dist\EnergyPortalManager.exe
```

---

## 🚀 如何使用 EXE

### 双击运行 → 选择操作

```
[1] 启动 CMS 后台
    └─ 编辑内容 → http://localhost:3001

[2] 预览站点
    └─ 查看最新网站 → http://localhost:5000

[3] 一键发布
    └─ 自动构建 + Git 推送到服务器

[0] 退出
```

---

## 📋 三个典型工作流

### 工作流 A：编辑并预览

```
1. 双击 EXE
2. 选 [1] 启动 CMS → 编辑内容 (http://localhost:3001)
3. 按 Ctrl+C 停止 CMS
4. 选 [2] 预览站点 → 查看效果 (http://localhost:5000)
5. 选 [0] 退出
```

### 工作流 B：发布到服务器

```
1. 双击 EXE
2. 选 [3] 一键发布
   ✓ 构建 CMS 数据
   ✓ 编译 Next.js 站点
   ✓ 推送到 Git 服务器
   ✓ 完成！
3. 选 [0] 退出
```

### 工作流 C：编辑 → 测试 → 发布

```
1. 双击 EXE
2. [1] 编辑 CMS 内容
   Ctrl+C 停止
3. [2] 预览检查效果
   Ctrl+C 停止
4. [3] 满意后一键发布
5. [0] 退出
```

---

## ⚙️ 技术细节

| 项 | 说明 |
|---|---|
| **EXE 大小** | ~60-80 MB |
| **包含内容** | Node.js 运行时 + 完整项目代码 |
| **分发** | 可复制到任何 Windows 电脑直接使用 |
| **依赖** | 无需事先安装 Node.js |
| **打包工具** | `pkg` (https://github.com/vercel/pkg) |

---

## ❓ 常见问题

**Q: 为什么 EXE 这么大？**  
A: 包含 Node.js 完整运行时，这样可以离线使用，不需要用户安装 Node.js。

**Q: 能在 Mac 或 Linux 上用吗？**  
A: 目前只支持 Windows (x64)。可以修改 `package.json` 中的 pkg 配置支持其他平台。

**Q: 修改代码后怎么更新？**  
A: 重新运行 `npm run pkg` 生成新的 EXE。

**Q: Git push 失败了怎么办？**  
A: 检查网络和 Git 凭证。也可以手动进入 `pioneer-cms/` 目录手动 push。

---

## 📚 详细文档

完整说明见 → [`EXE_BUILD_GUIDE.md`](./EXE_BUILD_GUIDE.md)

包含：
- 打包故障排除
- 项目结构要求
- 分发方式建议
- 后续改进方案
