import * as codeMirrorCommands from "@codemirror/commands"
import { 
    undo, redo, 
    indentMore, indentLess,
    deleteCharBackward, deleteCharForward,
    deleteGroupBackward, deleteGroupForward,
    deleteLineBoundaryBackward, deleteLineBoundaryForward,
    deleteToLineEnd, deleteToLineStart,
    simplifySelection,
    splitLine,
    insertNewlineAndIndent,
    toggleComment, toggleBlockComment, toggleLineComment,
    insertTab,
} from "@codemirror/commands"
import { foldCode, unfoldCode, toggleFold } from "@codemirror/language"
import { 
    openSearchPanel, closeSearchPanel, findNext, findPrevious, 
    selectMatches, replaceNext, replaceAll, 
} from "@codemirror/search"
import { selectNextOccurrence, selectSelectionMatches } from "./search/selection-match.js"
import { insertNewlineContinueMarkup } from "@codemirror/lang-markdown"

import { 
    addNewBlockAfterCurrent, addNewBlockBeforeCurrent, addNewBlockAfterLast, addNewBlockAfterLastAndScrollDown, 
    addNewBlockBeforeFirst, insertNewBlockAtCursor, 
    gotoPreviousBlock, gotoNextBlock, selectNextBlock, selectPreviousBlock,
    gotoPreviousParagraph, gotoNextParagraph, selectNextParagraph, selectPreviousParagraph,
    moveLineUp, moveLineDown,
    selectAll,
    deleteBlock, deleteBlockSetCursorPreviousBlock,
    newCursorBelow, newCursorAbove,
    moveCurrentBlockUp, moveCurrentBlockDown,
} from "./block/commands.js"
import { deleteLine } from "./block/delete-line.js"
import { formatBlockContent } from "./block/format-code.js"
import { transposeChars } from "./block/transpose-chars.js"

import { cutCommand, copyCommand, pasteCommand } from "./clipboard/copy-paste.js"

import { markModeMoveCommand, toggleSelectionMarkMode, selectionMarkModeCancel } from "./mark-mode.js"
import { insertDateAndTime } from "./date-time.js"
import { foldBlock, unfoldBlock, toggleBlockFold } from "./fold-gutter.js"
import { useHeynoteStore } from "../stores/heynote-store.js";
import { useSettingsStore } from "../stores/settings-store.js"
import { toggleSpellcheck, enableSpellcheck, disableSpellcheck } from "./spell-check.js"
import { insertIndentation } from "./indentation.js"
import { toggleCheckbox } from "./todo-checkbox.ts"


const cursorPreviousBlock = markModeMoveCommand(gotoPreviousBlock, selectPreviousBlock)
const cursorNextBlock = markModeMoveCommand(gotoNextBlock, selectNextBlock)
const cursorPreviousParagraph = markModeMoveCommand(gotoPreviousParagraph, selectPreviousParagraph)
const cursorNextParagraph = markModeMoveCommand(gotoNextParagraph, selectNextParagraph)


const openLanguageSelector = (editor) => () => {
    useHeynoteStore().openLanguageSelector()
    return true
}
const openBufferSelector = (editor) => () => {
    useHeynoteStore().openBufferSelector()
    return true
}
const openCommandPalette = (editor) => () => {
    useHeynoteStore().openCommandPalette()
    return true
}
const openMoveToBuffer = (editor) => () => {
    useHeynoteStore().openMoveToBufferSelector()
    return true
}
const openCreateNewBuffer = (editor) => () => {
    useHeynoteStore().openCreateBuffer("new")
    return true
}

const closeCurrentTab = (editor) => () => {
    useHeynoteStore().closeCurrentTab()
    return true
}
const reopenLastClosedTab = (editor) => () => {
    useHeynoteStore().reopenLastClosedTab()
    return true
}
const switchToLastTab = (editor) => () => {
    useHeynoteStore().switchToLastTab()
    return true
}
const nextTab = (editor) => () => {
    useHeynoteStore().nextTab()
    return true
}
const previousTab = (editor) => () => {
    useHeynoteStore().previousTab()
    return true
}

export function toggleAlwaysOnTop(editor) {
    return (view) => {
        const settingsStore = useSettingsStore()
        settingsStore.updateSettings({alwaysOnTop:!settingsStore.settings.alwaysOnTop})
        return true
    }
}

const nothing = (view) => {
    return true
}

const cmd = (f, category, description) => ({
    run: f,
    name: f.name,
    description: description,
    category: category,
})

const cmdLessContext = (f, category, description) => ({
    run: (editor) => f,
    name: f.name,
    description: description,
    category: category,
})


const HEYNOTE_COMMANDS = {
    addNewBlockAfterCurrent: cmd(addNewBlockAfterCurrent, "区块", "在当前区块后面添加新区块"),
    addNewBlockBeforeCurrent: cmd(addNewBlockBeforeCurrent, "区块", "在当前区块前面添加新区块"),
    addNewBlockAfterLast: cmd(addNewBlockAfterLast, "区块", "在最后一个区块后面添加新区块"),
    addNewBlockAfterLastAndScrollDown: cmd(addNewBlockAfterLastAndScrollDown, "区块", "在最后一个区块后面添加新区块并向下滚动"),
    addNewBlockBeforeFirst: cmd(addNewBlockBeforeFirst, "区块", "在第一个区块前面添加新区块"),
    insertNewBlockAtCursor: cmd(insertNewBlockAtCursor, "区块", "在光标处插入新区块"),
    deleteBlock: cmd(deleteBlock, "区块", "删除区块"),
    deleteBlockSetCursorPreviousBlock: cmd(deleteBlockSetCursorPreviousBlock, "区块", "删除区块并将光标移至上一个区块"),
    cursorPreviousBlock: cmd(cursorPreviousBlock, "光标", "将光标移至上一个区块"),
    cursorNextBlock: cmd(cursorNextBlock, "光标", "将光标移至下一个区块"),
    cursorPreviousParagraph: cmd(cursorPreviousParagraph, "光标", "将光标移至上一个段落"),
    cursorNextParagraph: cmd(cursorNextParagraph, "光标", "将光标移至下一个段落"),
    toggleSelectionMarkMode: cmd(toggleSelectionMarkMode, "光标", "切换选择标记模式"),
    selectionMarkModeCancel: cmd(selectionMarkModeCancel, "光标", "取消选择标记模式"),
    openLanguageSelector: cmd(openLanguageSelector, "区块", "选择区块语言"),
    openBufferSelector: cmd(openBufferSelector, "笔记", "切换笔记"),
    openCommandPalette: cmd(openCommandPalette, "编辑器", "打开命令面板"),
    openMoveToBuffer: cmd(openMoveToBuffer, "区块", "移动区块"),
    openCreateNewBuffer: cmd(openCreateNewBuffer, "笔记", "新建笔记"),
    cut: cmd(cutCommand, "剪贴板", "剪切所选内容"),
    copy: cmd(copyCommand, "剪贴板", "复制所选内容"),
    foldBlock: cmd(foldBlock, "区块", "折叠区块"),
    unfoldBlock: cmd(unfoldBlock, "区块", "展开区块"),
    toggleBlockFold: cmd(toggleBlockFold, "区块", "切换区块折叠状态"),

    // tab commands
    closeCurrentTab: cmd(closeCurrentTab, "笔记", "关闭当前标签页"),
    reopenLastClosedTab: cmd(reopenLastClosedTab, "笔记", "重新打开最近关闭的标签页"),
    switchToLastTab: cmd(switchToLastTab, "笔记", "切换到最后一个标签页"),
    previousTab: cmd(previousTab, "笔记", "切换到上一个标签页"),
    nextTab: cmd(nextTab, "笔记", "切换到下一个标签页"),
    ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [
        "switchToTab" + (i+1), 
        cmdLessContext(() => {
            useHeynoteStore().switchToTabIndex(i)
            return true
        }, "笔记", `切换到标签页 ${i+1}`),
    ])),

    // spellcheck
    toggleSpellcheck: cmd(toggleSpellcheck, "拼写检查", "切换拼写检查"),
    enableSpellcheck: cmd(enableSpellcheck, "拼写检查", "启用拼写检查"),
    disableSpellcheck: cmd(disableSpellcheck, "拼写检查", "禁用拼写检查"),
    toggleAlwaysOnTop: cmd(toggleAlwaysOnTop, "窗口", "切换窗口置顶"),

    // commands without editor context
    paste: cmdLessContext(pasteCommand, "剪贴板", "从剪贴板粘贴"),
    selectAll: cmdLessContext(selectAll, "选择", "全选"),
    moveLineUp: cmdLessContext(moveLineUp, "编辑", "上移一行"),
    moveLineDown: cmdLessContext(moveLineDown, "编辑", "下移一行"),
    deleteLine: cmdLessContext(deleteLine, "编辑", "删除行"),
    formatBlockContent: cmdLessContext(formatBlockContent, "区块", "格式化区块内容"),
    moveCurrentBlockUp: cmdLessContext(moveCurrentBlockUp, "区块", "上移当前区块"),
    moveCurrentBlockDown: cmdLessContext(moveCurrentBlockDown, "区块", "下移当前区块"),
    newCursorAbove: cmdLessContext(newCursorAbove, "光标", "在上方添加光标"),
    newCursorBelow: cmdLessContext(newCursorBelow, "光标", "在下方添加光标"),
    selectPreviousParagraph: cmdLessContext(selectPreviousParagraph, "选择", "选择到上一个段落"),
    selectNextParagraph: cmdLessContext(selectNextParagraph, "选择", "选择到下一个段落"),
    selectPreviousBlock: cmdLessContext(selectPreviousBlock, "选择", "选择到上一个区块"),
    selectNextBlock: cmdLessContext(selectNextBlock, "选择", "选择到下一个区块"),
    nothing: cmdLessContext(nothing, "其他", "无操作"),
    insertDateAndTime: cmdLessContext(insertDateAndTime, "其他", "插入日期和时间"),
    insertIndentation: cmdLessContext(insertIndentation, "编辑", "插入缩进"),

    // directly from CodeMirror
    undo: cmdLessContext(undo, "编辑", "撤销"),
    redo: cmdLessContext(redo, "编辑", "重做"),
    indentMore: cmdLessContext(indentMore, "编辑", "增加缩进"),
    indentLess: cmdLessContext(indentLess, "编辑", "减少缩进"),
    foldCode: cmdLessContext(foldCode, "编辑", "折叠代码"),
    unfoldCode: cmdLessContext(unfoldCode, "编辑", "展开代码"),
    toggleFold: cmdLessContext(toggleFold, "编辑", "切换折叠"),
    selectNextOccurrence: cmdLessContext(selectNextOccurrence, "光标", "选择下一个匹配项"),
    selectSelectionMatches: cmdLessContext(selectSelectionMatches, "光标", "选择所有与当前选区相同的项"),
    openSearchPanel: cmdLessContext(openSearchPanel, "搜索", "打开搜索面板"), 
    closeSearchPanel: cmdLessContext(closeSearchPanel, "搜索", "关闭搜索面板"),
    findNext: cmdLessContext(findNext, "搜索", "查找下一个"),
    findPrevious: cmdLessContext(findPrevious, "搜索", "查找上一个"),
    selectMatches: cmdLessContext(selectMatches, "搜索", "选择所有匹配项"),
    replaceNext: cmdLessContext(replaceNext, "搜索", "替换下一个"),
    replaceAll: cmdLessContext(replaceAll, "搜索", "全部替换"),
    deleteCharBackward: cmdLessContext(deleteCharBackward, "编辑", "向后删除字符"),
    deleteCharForward: cmdLessContext(deleteCharForward, "编辑", "向前删除字符"),
    deleteGroupBackward: cmdLessContext(deleteGroupBackward, "编辑", "向后删除一个词组"),
    deleteGroupForward: cmdLessContext(deleteGroupForward, "编辑", "向前删除一个词组"),
    deleteLineBoundaryBackward: cmdLessContext(deleteLineBoundaryBackward, "编辑", "删除到折行行首"),
    deleteLineBoundaryForward: cmdLessContext(deleteLineBoundaryForward, "编辑", "删除到折行行尾"),
    deleteToLineEnd: cmdLessContext(deleteToLineEnd, "编辑", "删除到行尾"),
    deleteToLineStart: cmdLessContext(deleteToLineStart, "编辑", "删除到行首"),
    simplifySelection: cmdLessContext(simplifySelection, "光标", "简化选择"),
    splitLine: cmdLessContext(splitLine, "编辑", "拆分行"),
    transposeChars: cmdLessContext(transposeChars, "编辑", "交换相邻字符"),
    insertNewlineAndIndent: cmdLessContext(insertNewlineAndIndent, "编辑", "插入换行并缩进"),
    insertNewlineContinueMarkup: cmdLessContext(insertNewlineContinueMarkup, "Markdown", "插入换行并延续待办列表/引用块"),
    toggleCheckbox: cmdLessContext(toggleCheckbox, "Markdown", "切换待办复选框"),
    toggleComment: cmdLessContext(toggleComment, "编辑", "切换注释"),
    toggleBlockComment: cmdLessContext(toggleBlockComment, "编辑", "切换块注释"),
    toggleLineComment: cmdLessContext(toggleLineComment, "编辑", "切换行注释"),
    insertTab: cmdLessContext(insertTab, "编辑", "插入 Tab"),
}

// selection mark-mode:ify all cursor/select commands from CodeMirror
for (let commandSuffix of [
    "CharLeft", "CharRight",
    "CharBackward", "CharForward",
    "LineUp", "LineDown",
    "LineStart", "LineEnd",
    "GroupLeft", "GroupRight",
    "GroupForward", "GroupBackward",
    "PageUp", "PageDown",
    "SyntaxLeft", "SyntaxRight",
    "SubwordBackward", "SubwordForward",
    "LineBoundaryBackward", "LineBoundaryForward",
    "DocStart", "DocEnd",
]) {
    HEYNOTE_COMMANDS[`cursor${commandSuffix}`] = {
        run: markModeMoveCommand(codeMirrorCommands[`cursor${commandSuffix}`], codeMirrorCommands[`select${commandSuffix}`]),
        name: `cursor${commandSuffix}`,
        description: `cursor${commandSuffix}`,
        category: "光标",
    }
    HEYNOTE_COMMANDS[`select${commandSuffix}`] = {
        run: (editor) => codeMirrorCommands[`select${commandSuffix}`],
        name: `select${commandSuffix}`,
        description: `select${commandSuffix}`,
        category: "光标",
    }
}

export { HEYNOTE_COMMANDS }
