const { app, Menu } = require("electron")
import { OPEN_SETTINGS_EVENT, UNDO_EVENT, REDO_EVENT, MOVE_BLOCK_EVENT, DELETE_BLOCK_EVENT, CHANGE_BUFFER_EVENT, SELECT_ALL_EVENT, SCRATCH_FILE_NAME } from '@/src/common/constants'
import { openAboutWindow } from "./about";
import { quit } from "./index"

import { getLanguageName } from "@/src/common/language-code/language-code"

const isMac = process.platform === "darwin"


const undoMenuItem = {
    label: '撤销',
    accelerator: 'CommandOrControl+z',
    click: (menuItem, window, event) => {
        window?.webContents.send(UNDO_EVENT)
    },
}

const redoMenuItem = {
    label: '重做',
    accelerator: 'CommandOrControl+Shift+z',
    click: (menuItem, window, event) => {
        window?.webContents.send(REDO_EVENT)
    },
}

const selectAllMenuItem = {
    label: '全选',
    accelerator: 'CommandOrControl+a',
    click: (menuItem, window, event) => {
        window?.webContents.send(SELECT_ALL_EVENT)
    },
}

const deleteBlockMenuItem = {
    label: '删除区块',
    accelerator: 'CommandOrControl+Shift+D',
    click: (menuItem, window, event) => {
        window?.webContents.send(DELETE_BLOCK_EVENT)
    },
}

const moveBlockMenuItem = {
    label: '将区块移动到其他笔记…',
    accelerator: 'CommandOrControl+S',
    click: (menuItem, window, event) => {
        window?.webContents.send(MOVE_BLOCK_EVENT)
    },
}

const changeBufferMenuItem = {
    label: '切换笔记…',
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
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : [{
        role: 'fileMenu',
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
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                selectAllMenuItem,
                { type: 'separator' },
                {
                    label: '语音',
                    submenu: [
                        { role: 'startSpeaking' },
                        { role: 'stopSpeaking' }
                    ]
                }
            ] : [
                { role: 'delete' },
                { type: 'separator' },
                selectAllMenuItem,
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: '视图',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            {
                accelerator: 'CommandOrControl+=',
                role: "zoomIn",
                visible: false
            },
            {
                accelerator: 'CmdOrCtrl+Plus',
                role: "zoomIn",
                visible: true
            },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: '窗口',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                { role: 'close' }
            ])
        ]
    },
    {
        role: 'help',
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
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
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
            label: '打开笔记…',
            click: () => {
                win?.webContents.send('tab:openNew')
            },
        },
        {
            label: '新建笔记…',
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
