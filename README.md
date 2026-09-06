# Heynote

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/tokangaroo/heynote-zh)](https://github.com/tokangaroo/heynote-zh/releases)
[![Build Status](https://github.com/tokangaroo/heynote-zh/actions/workflows/tests.yml/badge.svg)](https://github.com/tokangaroo/heynote-zh/actions/workflows/tests.yml)

<img src="https://heynote.com/img/logo.png" style="width:79px;">

## 基本信息

- [官网](https://heynote.com)
- [文档](https://heynote.com/docs/)
- [更新日志](https://heynote.com/docs/changelog/)

Heynote 是一款专为开发者和高级用户打造的便签本。它就像一个大型的持久化文本缓冲区，你可以随手记录任何内容。非常适合用来写那条不想误发的 Slack 消息、调试接口时的 JSON 响应、会议笔记、每日待办清单等等。

Heynote 的缓冲区划分为多个区块（Block），每个区块都可以设置自己的语言（如 JavaScript、JSON、Markdown 等）。这让你可以获得语法高亮，还能自动格式化 JSON 响应。

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


## 文档

[文档](https://heynote.com/docs/)发布在 Heynote 官网上。

## 开发

开发 Heynote 需要 Node.js，通常只需检出代码后运行：

```
> npm install
> npm run dev
```

### 运行测试

运行测试：

```
> npm run test
```

在 Playwright UI 中运行测试：

```
> npm run test:ui
```


### 参与贡献

欢迎提交符合我对这款应用愿景的贡献，Bug 修复随时欢迎。


## 常见问题（FAQ）

### 笔记数据存储在哪里？

参见[文档](https://heynote.com/docs/#user-content-the-notes-library)。

### 会开发移动版应用吗？

不会，目前这不在计划范围内，抱歉。

### 默认快捷键有哪些？

参见[文档](https://heynote.com/docs/#user-content-default-key-bindings)。


## 致谢！

Heynote 基于 [CodeMirror](https://codemirror.net/)、[Vue](https://vuejs.org/)、[Electron](https://www.electronjs.org/)、[Math.js](https://mathjs.org/)、[Prettier](https://prettier.io/) 以及其他优秀的开源项目构建。
