# Heynote 文档

[更新日志](/docs/changelog/)

Heynote 是一款专属便签本。它就像一个大型的持久化文本缓冲区，你可以随手记录任何内容。非常适合用来写那条不想误发的 Slack 消息、调试接口时的 JSON 响应、会议笔记、每日待办清单等等。

Heynote 的缓冲区划分为多个区块（Block），每个区块都可以设置自己的模式（如 JavaScript、JSON、Markdown 等）。这让你可以获得语法高亮，还能自动格式化 JSON 响应。

支持 Mac、Windows 和 Linux。

## 功能特性

-   持久化文本缓冲区
-   基于区块（Block）组织内容
-   内联图片
-   多笔记多标签页
-   数学/计算器模式
-   货币换算
-   语法高亮：

    C++、C#、Clojure、CSS、Elixir、Erlang、Dart、Go、Groovy、HTML、Java、JavaScript、JSX、Kotlin、TypeScript、TOML、TSX、JSON、Lezer、Markdown、PHP、Python、Ruby、Rust、Scala、Shell、SQL、Swift、Vue、XML、YAML

-   语言自动检测
-   自动格式化
-   多光标编辑
-   深色与浅色主题
-   可设置显示/隐藏应用的全局快捷键
-   默认、类 Emacs 或自定义按键绑定
-   拼写检查


## 默认按键绑定<a id="default-key-bindings"></a>

<!-- keyboard_shortcuts -->

**Mac 上**

```
⌘ + Enter           在当前区块下方添加新区块
⌥ + Enter           在当前区块上方添加新区块
⌘ + Shift + Enter   在笔记末尾添加新区块
⌥ + Shift + Enter   在笔记开头添加新区块
⌘ + ⌥ + Enter       在光标位置拆分当前区块
⌘ + L               更改区块语言
⌘ + N               新建笔记
⌘ + S               将当前区块移动到其他（或新的）笔记
⌘ + P               打开笔记选择器
⌘ + Shift + P       打开命令面板
⌘ + Down            跳转到下一个区块
⌘ + Up              跳转到上一个区块
⌘ + A               全选当前区块中的文本；再按一次选择整个笔记
⌘ + ⌥ + Up/Down     在上方/下方添加光标
⌥ + Shift + F       格式化区块内容（支持 JSON、JavaScript、HTML、CSS 和 Markdown）
⌘ + ⌥ + [           折叠区块
⌘ + ⌥ + ]           展开区块
⌘ + ⌥ + .           切换区块折叠状态
```

**Windows 和 Linux 上**

```
Ctrl + Enter           在当前区块下方添加新区块
Alt + Enter            在当前区块上方添加新区块
Ctrl + Shift + Enter   在笔记末尾添加新区块
Alt + Shift + Enter    在笔记开头添加新区块
Ctrl + Alt + Enter     在光标位置拆分当前区块
Ctrl + L               更改区块语言
Ctrl + N               新建笔记
Ctrl + S               将当前区块移动到其他（或新的）笔记
Ctrl + P               打开笔记选择器
Ctrl + Shift + P       打开命令面板
Ctrl + Down            跳转到下一个区块
Ctrl + Up              跳转到上一个区块
Ctrl + A               全选当前区块中的文本；再按一次选择整个笔记
Ctrl + Alt + Up/Down   在上方/下方添加光标
Alt + Shift + F        格式化区块内容（支持 JSON、JavaScript、HTML、CSS 和 Markdown）
Ctrl + Alt + [         折叠区块
Ctrl + Alt + ]         展开区块
Ctrl + Alt + .         切换区块折叠状态
```

你可以在命令面板以及"设置 → 快捷键"中查看所有按键绑定。



## 自定义按键绑定<a id="custom-key-bindings"></a>

Heynote 支持自定义按键绑定，你可以在设置中进行配置。按键绑定按从上到下的顺序生效，排在前面的绑定优先级更高。大多数命令会阻止事件继续传播，但有些命令只在特定上下文中生效，可能不会阻止事件传播到后面的按键绑定。

要禁用某个内置按键绑定，你可以为命令"无操作"（Do nothing）添加一个使用相同按键组合的新绑定。这样事件就不会传播到内置的按键绑定。

你可以在命令面板中查看所有可绑定到按键的命令，命令面板可通过 Mac 上的 `⌘ + ⇧ + P`、Windows/Linux 上的 `Ctrl + ⇧ + P` 打开。

## 下载/安装

从 [heynote.com](https://heynote.com) 下载对应平台（Mac、Windows 或 Linux）的版本。Windows 版本未经签名，因此你可能会看到一些吓人的警告（为了消除这个警告而每年支付证书费用并不划算）。

如果要在 ChromeOS 的 Linux 环境中安装 Heynote，请参阅下文关于[所需软件包](#user-content-linux-on-chromeos)的说明。

macOS 上，[Homebrew](https://brew.sh) 用户可以使用非官方的 [Homebrew Cask](https://formulae.brew.sh/cask/heynote#default)：`brew install --cask heynote`

## 数学区块<a id="math-blocks"></a>

Heynote 的数学区块由 [Math.js 表达式](https://mathjs.org/docs/expressions)驱动。请查阅其[文档](https://mathjs.org/docs/)了解可用的[语法](https://mathjs.org/docs/expressions/syntax.html)、[函数](https://mathjs.org/docs/reference/functions.html)和[常量](https://mathjs.org/docs/reference/constants.html)。

### 访问上一个结果

可以使用变量 `prev` 来访问上一个结果。例如：

```
128
prev * 2 # 256
```

### 更改数学区块结果的格式

你可以在数学区块中定义自定义 `format` 函数，例如：

```
_format = format # 保存对内置 format 函数的引用
format(x) = _format(x, {notation:"exponential"})
```

你也可以这样让数字以默认区域设置显示，或提供[自定义区域设置](https://www.w3.org/International/articles/language-tags/)：

```
format(x) = x.toLocaleString();
format(x) = x.toLocaleString('en-GB');
```

有关支持的更多细节，请参阅 [Math.js format()](https://mathjs.org/docs/reference/functions/format.html) 函数。

## 图片

从剪贴板粘贴图片数据时，会在缓冲区中插入一张内联图片。图片数据在内部保存到[笔记库](#user-content-the-notes-library)的 `.images` 目录下的文件中。拖放图片文件也会将图片插入到编辑器中（图片的副本会被放入 `.images` 目录）。

图片可以在显示时调整大小，但底层的图片数据保持原始尺寸。当光标位于图片旁边时执行复制命令（默认按键绑定为 `Ctrl/Cmd-C`），系统剪贴板将被填充为该图片的数据。


## 笔记库<a id="the-notes-library"></a>

笔记库是磁盘上的一个目录（包含子目录），每个笔记对应一个 `.txt` 文件。首次启动 Heynote 时会自动创建，其中包含默认的笔记文件 `scratch.txt`。笔记库的默认位置为：

-   Mac：`~/Library/Application Support/Heynote/notes/`
-   Windows：`%APPDATA%\Heynote\notes\`
-   Linux：`~/.config/Heynote/notes/`

你可以在设置中更改笔记库的路径。Heynote 需要对笔记库有较快的磁盘访问速度，因此不建议使用网络驱动器，不过 Dropbox、OneDrive 等文件同步服务应该可以正常使用（见下文）。

### 图片存储

图片与笔记一起存储在笔记库目录下的隐藏 `.images` 文件夹中。每张图片都从笔记文件中被引用，应用会利用这些引用随时间清理较旧的、未被引用的图片。清理在启动时运行，只会删除超过 24 小时且未被引用的图片（作为安全检查，只有存在被引用图片时才会执行清理）。

### 同步笔记库

Heynote 的设计支持通过 Dropbox、OneDrive 等文件同步服务同步笔记库（Heynote 1.x 中则是缓冲区文件）。但请注意，同步逻辑比较简单，同时在两台不同的机器上编辑同一个笔记可能会导致冲突和意外结果。

使用支持云端"释放空间"（从磁盘移除文件）的文件同步服务时，建议将笔记库标记为"始终保留在此设备上"。

一如既往，请务必备份重要内容。


## 拼写检查

点击状态栏中的拼写检查图标即可开启或关闭拼写检查。在 Windows 和 Linux 上，右键点击该图标可以选择启用的词典（Mac 上使用系统默认词典）。


## Linux<a id="linux"></a>

### ChromeOS 上的 Linux<a id="linux-on-chromeos"></a>

据反馈（[(#48)](https://github.com/heyman/heynote/issues/48)），ChromeOS 的 Debian 虚拟机需要安装以下软件包才能运行 Heynote AppImage：

```
libfuse2
libnss3
libnspr4
```

### Wayland

由于 [Electron 的一个问题](https://github.com/electron/electron/issues/38288)，全局快捷键在 Wayland 下并非在所有应用中都能生效。在 KDE 中，可以通过添加以下 Kwin 脚本来绕过这一限制：

```javascript
function toggleHeynote() {
  var client = workspace.clientList().find((c) => c.resourceClass.toLowerCase() === 'heynote');
  if (client) {
    if (client.minimized) {
      client.minimized = false;
      workspace.activeClient = client;
    } else {
      if (workspace.activeClient == client) {
        client.minimized = true;
      } else {
        workspace.activeClient = client;
      }
    }
  }
}
registerShortcut('toggleHeynote', 'Toggle Heynote', 'Ctrl+Shift+H', toggleHeynote);
```

安装脚本的方法请参阅 [KWin 脚本教程](https://develop.kde.org/docs/plasma/kwin/)。

请记得在 KDE 系统设置中启用该脚本。可能还需要进入 KDE 系统设置手动绑定"Toggle Heynote"按键。
