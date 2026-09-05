const { app, Menu } = require("electron")
import { OPEN_SETTINGS_EVENT, UNDO_EVENT, REDO_EVENT, MOVE_BLOCK_EVENT, DELETE_BLOCK_EVENT, CHANGE_BUFFER_EVENT, SELECT_ALL_EVENT, SCRATCH_FILE_NAME } from '@/src/common/constants'
import { openAboutWindow } from "./about";
import { quit } from "./index"

import { getLanguageName } from "@/src/common/language-code/language-code"

const isMac = process.platform === "darwin"

// Windows/Linux 原生菜单中"菜单文字"与右侧快捷键的间距按最长行计算且不可配置，
// 通过给带快捷键的菜单项追加全角空格来拉开间距（macOS 菜单由系统排版，无需处理）
const ACCEL_PAD = isMac ? "" : "\u3000"


const undoMenuItem = {
    label: '撤销' + ACCEL_PAD,
    accelerator: 'CommandOrControl+z',
    click: (menuItem, window, event) => {
        window?.webContents.send(UNDO_EVENT)
    },
}

const redoMenuItem = {
    label: '重做' + ACCEL_PAD,
    accelerator: 'CommandOrControl+Shift+z',
    click: (menuItem, window, event) => {
        window?.webContents.send(REDO_EVENT)
    },
}

const selectAllMenuItem = {
    label: '全选' + ACCEL_PAD,
    accelerator: 'CommandOrControl+a',
    click: (menuItem, window, event) => {
        window?.webContents.send(SELECT_ALL_EVENT)
    },
}

const deleteBlockMenuItem = {
    label: '删除区块' + ACCEL_PAD,
    accelerator: 'CommandOrControl+Shift+D',
    click: (menuItem, window, event) => {
        window?.webContents.send(DELETE_BLOCK_EVENT)
    },
}

const moveBlockMenuItem = {
    label: '移动区块' + ACCEL_PAD,
    accelerator: 'CommandOrControl+S',
    click: (menuItem, window, event) => {
        window?.webContents.send(MOVE_BLOCK_EVENT)
    },
}

const changeBufferMenuItem = {
    label: '切换笔记' + ACCEL_PAD,
    accelerator: 'CommandOrControl+P',
    click: (menuItem, window, event) => {
        window?.webContents.send(CHANGE_BUFFER_EVENT)
    },
}

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: '关于', 
                click: (menuItem, window, event) => {
                    // open about window
                    openAboutWindow()
                },
            },
            { type: 'separator' },
            changeBufferMenuItem,
            {
                label: '设置',
                click: (menuItem, window, event) => {
                    window?.webContents.send(OPEN_SETTINGS_EVENT)
                },
                accelerator: isMac ? 'Command+,': null,
            },
            { type: 'separator' },
            { role: 'services', label: '服务' },
            { type: 'separator' },
            { role: 'hide', label: '隐藏' },
            { role: 'hideOthers', label: '隐藏其他' },
            { role: 'unhide', label: '全部显示' },
            { type: 'separator' },
            { role: 'quit', label: '退出' }
        ]
    }] : [{
        role: 'fileMenu',
        label: '文件',
        submenu: [
            changeBufferMenuItem,
            {
                label: '设置',
                click: (menuItem, window, event) => {
                    window?.webContents.send(OPEN_SETTINGS_EVENT)
                },
            },
            {
                label: '关于', 
                click: (menuItem, window, event) => {
                    // open about window
                    openAboutWindow()
                },
            },
        ],
    }]),
    /*{
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },*/
    // { role: 'editMenu' }
    {
        label: '编辑',
        submenu: [
            undoMenuItem,
            redoMenuItem,
            { type: 'separator' },
            deleteBlockMenuItem,
            moveBlockMenuItem,
            { type: 'separator' },
            { role: 'cut', label: '剪切' },
            { role: 'copy', label: '复制' },
            { role: 'paste', label: '粘贴' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle', label: '粘贴并匹配样式' },
                { role: 'delete', label: '删除' },
                selectAllMenuItem,
                { type: 'separator' },
                {
                    label: '语音',
                    submenu: [
                        { role: 'startSpeaking', label: '开始朗读' },
                        { role: 'stopSpeaking', label: '停止朗读' }
                    ]
                }
            ] : [
                { role: 'delete', label: '删除' },
                { type: 'separator' },
                selectAllMenuItem,
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: '视图',
        submenu: [
            { role: 'reload', label: '重新加载' },
            { role: 'forceReload', label: '强制重新加载' },
            { role: 'toggleDevTools', label: '切换开发者工具' },
            { type: 'separator' },
            { role: 'resetZoom', label: '重置缩放' },
            {
                accelerator: 'CommandOrControl+=',
                role: "zoomIn",
                label: '放大',
                visible: false
            },
            {
                accelerator: 'CmdOrCtrl+Plus',
                role: "zoomIn",
                label: '放大',
                visible: true
            },
            { role: 'zoomOut', label: '缩小' },
            { type: 'separator' },
            { role: 'togglefullscreen', label: '切换全屏' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: '窗口',
        submenu: [
            { role: 'minimize', label: '最小化' },
            { role: 'zoom', label: '缩放' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front', label: '全部置前' },
                { type: 'separator' },
                { role: 'window', label: '窗口' }
            ] : [
                { role: 'close', label: '关闭' }
            ])
        ]
    },
    {
        role: 'help',
        label: '帮助',
        submenu: [
            {
                label: '文档',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://heynote.com/docs/')
                }
            },
            {
                label: '网站',
                click: async () => {
                    const { shell } = require('electron')
                    await shell.openExternal('https://heynote.com')
                }
            }
        ]
    }
]

export const menu = Menu.buildFromTemplate(template)


export function getTrayMenu(win) {
    return Menu.buildFromTemplate([
        {
            label: '打开 Heynote',
            click: () => {
                win.show()
            },
        },
        { type: 'separator' },
        ...template,
        { type: 'separator' },
        {
            label: '退出',
            click: () => {
                quit()
            },
        },
    ])
}

export function getEditorContextMenu(win) {
    return Menu.buildFromTemplate([
        undoMenuItem,
        redoMenuItem,
        {type: 'separator'},
        {role: 'cut', label: '剪切'},
        {role: 'copy', label: '复制'},
        {role: 'paste', label: '粘贴'},
        {type: 'separator'},
        selectAllMenuItem,
        {type: 'separator'},
        deleteBlockMenuItem,
        moveBlockMenuItem,
    ])
}

export function getTabContextMenu(win, tabPath) {
    const isScratchFile = tabPath === SCRATCH_FILE_NAME
    
    const menuItems = []
    
    if (!isScratchFile) {
        menuItems.push(
            {
                label: '编辑笔记',
                click: () => {
                    win?.webContents.send('tab:editBuffer', tabPath)
                },
            },
            {
                label: '删除笔记',
                click: () => {
                    win?.webContents.send('tab:deleteBuffer', tabPath)
                },
            }
        )
    }

    menuItems.push(
        {
            label: '打开笔记',
            click: () => {
                win?.webContents.send('tab:openNew')
            },
        },
        {
            label: '新建笔记',
            click: () => {
                win?.webContents.send('tab:createNew')
            },
        },
        {type: 'separator'},
        {
            label: '关闭标签页',
            click: () => {
                win?.webContents.send('tab:close', tabPath)
            },
        },
    )
    
    return Menu.buildFromTemplate(menuItems)
}


export function getSpellcheckingContextMenu(win) {
    const languages = win.webContents.session.availableSpellCheckerLanguages
    const selectedLanguages = win.webContents.session.getSpellCheckerLanguages()
    //console.log("Available spellchecker languages:", languages)
    //console.log("selected languages:", selectedLanguages)
    
    //win.webContents.session.listWordsInSpellCheckerDictionary().then((words) => {
    //    console.log("words:", words)
    //})

    const menuItems = []
    for (const lang of languages) {
        menuItems.push({
            label: getLanguageName(lang),
            type: 'checkbox',
            checked: selectedLanguages.includes(lang),
            click: () => {
                if (selectedLanguages.includes(lang)) {
                    win.webContents.session.setSpellCheckerLanguages(selectedLanguages.filter(l => l !== lang))
                } else {
                    win.webContents.session.setSpellCheckerLanguages([...selectedLanguages, lang])
                }
            },
        })
    }

    return Menu.buildFromTemplate(menuItems)
}
