export const keyHelpStr = (platform: string, extended: boolean = false) => {
    const modChar = platform === "darwin" ? "⌘" : "Ctrl"
    const altChar = platform === "darwin" ? "⌥" : "Alt"

    const keyHelp = [
        [`${modChar} + Enter`, "在当前区块下方添加新区块"],
        [`${altChar} + Enter`, "在当前区块上方添加新区块"],
        [`${modChar} + Shift + Enter`, "在笔记末尾添加新区块"],
        [`${altChar} + Shift + Enter`, "在笔记开头添加新区块"],
        [`${modChar} + ${altChar} + Enter`, "在光标位置拆分当前区块"],
        [`${modChar} + L`, "更改区块语言"],
        [`${modChar} + N`, "新建笔记"],
        [`${modChar} + S`, "将当前区块移动到其他（或新的）笔记"],
        [`${modChar} + P`, "打开笔记选择器"],
        [`${modChar} + Shift + P`, "打开命令面板"],
        [`${modChar} + Down`, "跳转到下一个区块"],
        [`${modChar} + Up`, "跳转到上一个区块"],
        [`${modChar} + A`, "全选当前区块中的文本；再按一次选择整个笔记"],
        [`${modChar} + ${altChar} + Up/Down`, "在上方/下方添加光标"],
        [`${altChar} + Shift + F`, "格式化区块内容（支持 JSON、JavaScript、HTML、CSS 和 Markdown）"],
    ]

    if (extended) {
        keyHelp.push(
            [`${modChar} + ${altChar} + [`, "折叠区块"],
            [`${modChar} + ${altChar} + ]`, "展开区块"],
            [`${modChar} + ${altChar} + .`, "切换区块折叠状态"],
        )
    }
    
    const keyMaxLength = keyHelp.map(([key]) => key.length).reduce((a, b) => Math.max(a, b))

    return keyHelp.map(([key, help]) => `${key.padEnd(keyMaxLength)}   ${help}`).join("\n")
}