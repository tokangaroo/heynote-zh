# Heynote-zh 构建指南

本文档描述如何构建 heynote-zh 的全部发布产物（Windows / Linux 双平台、双架构），以及如何通过 GitHub Actions 自动构建。

## 产物清单

| # | 文件名 | 说明 |
|---|---|---|
| 1 | `Heynote_zh_<版本>_win_x64.exe` | Windows x64 安装包（NSIS） |
| 2 | `Heynote_zh_<版本>_win_x64.zip` | Windows x64 便携版 |
| 3 | `Heynote_zh_<版本>_win_arm64.exe` | Windows ARM64 安装包 |
| 4 | `Heynote_zh_<版本>_win_arm64.zip` | Windows ARM64 便携版 |
| 5 | `Heynote_zh_<版本>_linux_amd64.AppImage` | Linux x64 便携版 |
| 6 | `Heynote_zh_<版本>_linux_amd64.deb` | Linux x64 deb 包 |
| 7 | `Heynote_zh_<版本>_linux_arm64.AppImage` | Linux ARM64 便携版 |
| 8 | `Heynote_zh_<版本>_linux_arm64.deb` | Linux ARM64 deb 包 |

版本号取自 `package.json` 的 `version` 字段，所有产物输出到 `release/<版本>/`。

## 环境要求

| 要求 | 说明 |
|---|---|
| Node.js ≥ 22 | vite 6 与 `@electron/rebuild` 4.x 的要求 |
| PowerShell | 本文档命令均为 PowerShell 语法（bash 用户见文末备注） |
| npm install | 首次构建前执行一次，自动打 patch-package 补丁 |
| 管理员终端 或 开发人员模式 | **仅本地打 Linux 包需要**（AppImage 工具链要创建符号链接），见 FAQ #1 |

## 本地构建（Windows）

> **核心原则**：搜索功能依赖的 ripgrep 二进制（`@vscode/ripgrep`）按 CPU 架构下载，
> 因此必须 **先打 x64 包 → 切 rg 到 arm64 → 再打 arm64 包**。
> 切换命令必须带 `--force`（否则 bin 目录已存在会跳过下载，arm64 包里会混入 x64 的 rg）。

### 第 0 步：生成前端产物

```powershell
npm run prebuild
```

执行内容：`vue-tsc` 类型检查 → `vite build`（渲染层 + 主进程）。每次构建前跑一次即可。

### 第 1 步：构建 Windows 包

```powershell
# --- x64 ---
npx electron-builder -c electron-builder.json5 --win --x64

# --- 切换 rg 到 arm64 ---
$env:npm_config_arch = "arm64"
node node_modules/@vscode/ripgrep/lib/postinstall.js --force

# --- arm64 ---
npx electron-builder -c electron-builder.json5 --win --arm64

# --- 恢复本机 rg（可选）---
$env:npm_config_arch = "x64"
node node_modules/@vscode/ripgrep/lib/postinstall.js --force
Remove-Item Env:npm_config_arch
```

### 第 2 步：构建 Linux 包（需管理员终端或开发人员模式）

```powershell
# --- amd64 ---
npx electron-builder -c electron-builder.json5 --linux --x64

# --- 切换 rg 到 arm64 ---
$env:npm_config_arch = "arm64"
node node_modules/@vscode/ripgrep/lib/postinstall.js --force

# --- arm64 ---
npx electron-builder -c electron-builder.json5 --linux --arm64

# --- 恢复本机 rg（可选）---
$env:npm_config_arch = "x64"
node node_modules/@vscode/ripgrep/lib/postinstall.js --force
Remove-Item Env:npm_config_arch
```

### 第 3 步：AppImage 改名 + 验收

electron-builder 对 AppImage 的 `${arch}` 展开为 `x86_64`（deb 展开为 `amd64`），需改名对齐：

```powershell
cd release/<版本>
Rename-Item "Heynote_zh_<版本>_linux_x86_64.AppImage" "Heynote_zh_<版本>_linux_amd64.AppImage"
```

然后核对 `release/<版本>/` 下 8 个产物齐全。

> 正式发布建议先 `Remove-Item -Recurse -Force release` 清空后重新构建，避免混入历史残留。

## GitHub Actions 自动构建

工作流：`.github/workflows/build.yml`。windows-latest 构建 4 个 Windows 产物，ubuntu-latest 构建 4 个 Linux 产物，双 job 并行，各自"先 x64 → 切 rg → 再 arm64"，并自动完成 AppImage 改名——与本地构建完全等价。

工作流要点：

- 注入 `GITHUB_TOKEN`（ripgrep 下载 anti-403 限流）与 `GH_TOKEN`（electron-builder 发布）
- Node 22，依赖 `npm ci`，使用内置 token，**无需配置任何 secrets**
- macOS 构建已移除（无签名证书，且本项目不需要）

### 触发方式（二选一）

```powershell
# 方式一：commit 信息含 #build，仅构建产物（Artifacts 下载）
git commit -m "xxx #build"
git push

# 方式二：推 v* 标签，构建并自动发布到 GitHub Releases（推荐发版用）
git tag v2.8.2
git push origin v2.8.2
```

### 获取产物

- **Artifacts**：仓库页 → Actions → 对应运行记录 → 底部 Artifacts
  - `heynote-zh-windows-<commit>`：4 个 Windows 产物
  - `heynote-zh-linux-<commit>`：4 个 Linux 产物
- **Releases**：tag 触发的构建会把 8 个产物直接挂到对应 Release 下

## 发布新版本完整流程

```powershell
# 1. 确认 package.json version 已更新，且工作区干净
git status

# 2. 提交并推送
git push

# 3. 打标签（与 version 一致）并推送，触发自动构建与发布
git tag v<版本>
git push origin v<版本>

# 4. 到 Actions 页确认两个 job 全绿，再到 Releases 页确认 8 个产物齐全
```

## 常见问题

**1. 本地打 Linux 包报 `Cannot create symbolic link : 客户端没有所需的特权`**
AppImage 工具链解压缓存需要符号链接特权。以管理员身份运行终端，或开启 Windows 开发人员模式（推荐，一次设置永久生效）。不影响 Windows 包构建和 GitHub Actions 构建。

**2. arm64 包里搜索不可用 / rg 架构不对**
打 arm64 包前没切 rg，或切换命令漏了 `--force`。正确命令：

```powershell
$env:npm_config_arch = "arm64"
node node_modules/@vscode/ripgrep/lib/postinstall.js --force
```

**3. 报错 `npm_config_arch=arm64 : 无法将...项识别为 cmdlet`**
用了 bash 的行内环境变量语法。PowerShell 必须先用 `$env:npm_config_arch = "arm64"` 设置变量，再单独执行 node 命令。

**4. CI 里 ripgrep 下载报 403**
GitHub API 匿名限流（60 次/小时）。工作流已注入 `GITHUB_TOKEN` 解决；若自行改工作流，注意 ripgrep 只认 `GITHUB_TOKEN` 这个变量名（electron-builder 用的是 `GH_TOKEN`，两者都要有）。

**5. `--x64` 构建却把 arm64 也构建了**
`electron-builder.json5` 的 target 里写了 `arch` 数组——它会覆盖 CLI 架构参数。arch 必须由 CLI `--x64` / `--arm64` 控制，config 里不要写。

**6. deb 报 `Please specify author 'email'`**
已在 `electron-builder.json5` 的 linux 节配置 `maintainer`，若报错请检查该配置是否存在。

**7. 日志出现 `existingType=release publishingType=draft`，产物没挂到 Release**
electron-builder 默认以草稿方式发布，与已存在的正式 Release 类型不匹配会跳过上传。已在 config 顶层设置 `publish: [{ provider: "github", releaseType: "release" }]`。

**8. 报 `ERR_ELECTRON_BUILDER_CANNOT_EXECUTE`**
多为首次构建下载 Electron 发行包/工具链时的网络问题，重试即可；CI 环境一般无此问题。

---

> **bash 用户备注**：行内环境变量写法为 `npm_config_arch=arm64 node ...`，文件改名用 `mv`，删除目录用 `rm -rf`。
