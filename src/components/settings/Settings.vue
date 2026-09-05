<script>
    import { toRaw} from 'vue';
    import { mapStores, mapState } from 'pinia'
    import { useSettingsStore } from "@/src/stores/settings-store.js"

    import { LANGUAGES } from '../../editor/languages.js'
    import KeyboardHotkey from "./KeyboardHotkey.vue"
    import TabListItem from "./TabListItem.vue"
    import TabContent from "./TabContent.vue"
    import KeyboardBindings from './KeyboardBindings.vue'

    const defaultFontFamily = window.heynote.defaultFontFamily
    const defaultFontSize = window.heynote.defaultFontSize
    const defaultDefaultBlockLanguage = "text"
    const defaultDefaultBlockLanguageAutoDetect = true
    
    export default {
        props: {
            initialKeymap: String,
            initialSettings: Object,
            themeSetting: String,
        },
        components: {
            KeyboardHotkey,
            TabListItem,
            TabContent,
            KeyboardBindings,
        },

        data() {
            //console.log("settings:", this.initialSettings)
            return {
                keymaps: [
                    { name: "默认", value: "default" },
                    { name: "Emacs", value: "emacs" },
                ],
                keymap: this.initialSettings.keymap,
                keyBindings: this.initialSettings.keyBindings || [],
                metaKey: this.initialSettings.emacsMetaKey,
                isMac: window.heynote.platform.isMac,
                showLineNumberGutter: this.initialSettings.showLineNumberGutter,
                showFoldGutter: this.initialSettings.showFoldGutter,
                showWhitespace: this.initialSettings.showWhitespace,
                showTabs: this.initialSettings.showTabs,
                showTabsInFullscreen: this.initialSettings.showTabsInFullscreen,
                allowBetaVersions: this.initialSettings.allowBetaVersions,
                enableGlobalHotkey: this.initialSettings.enableGlobalHotkey,
                globalHotkey: this.initialSettings.globalHotkey,
                showInDock: this.initialSettings.showInDock,
                showInMenu: this.initialSettings.showInMenu,
                alwaysOnTop: this.initialSettings.alwaysOnTop,
                bracketClosing: this.initialSettings.bracketClosing,
                indentType: this.initialSettings.indentType || "space",
                tabSize: this.initialSettings.tabSize || 4,
                autoUpdate: this.initialSettings.autoUpdate,
                bufferPath: this.initialSettings.bufferPath,
                fontFamily: this.initialSettings.fontFamily || defaultFontFamily,
                fontSize: this.initialSettings.fontSize || defaultFontSize,
                cursorBlinkRate: this.initialSettings.cursorBlinkRate ?? 1000,
                languageOptions: LANGUAGES.map(l => {
                    return {
                        "value": l.token, 
                        "name": l.token == "text" ? l.name + "（默认）" : l.name,
                    }
                }).sort((a, b) => {
                    return a.name.localeCompare(b.name)
                }),
                defaultBlockLanguage: this.initialSettings.defaultBlockLanguage || defaultDefaultBlockLanguage,
                defaultBlockLanguageAutoDetect: this.initialSettings.defaultBlockLanguageAutoDetect === false ? false : defaultDefaultBlockLanguageAutoDetect,

                activeTab: "general",
                isWebApp: window.heynote.platform.isWebApp,
                customBufferLocation: !!this.initialSettings.bufferPath,
                systemFonts: [[defaultFontFamily, defaultFontFamily + "（默认）"]],
                defaultFontSize: defaultFontSize,
                appVersion: "",
                theme: this.themeSetting,

                // tracks if the add key binding dialog is visible (so that we can set inert on the save button)
                addKeyBindingDialogVisible: false,
            }
        },

        async mounted() {
            window.addEventListener("keydown", this.onKeyDown);

            this.appVersion = await window.heynote.getVersion()

            if (window.queryLocalFonts !== undefined) {
                let localFonts = [... new Set((await window.queryLocalFonts()).map(f => f.family))].filter(f => f !== "Hack")
                localFonts = [...new Set(localFonts)].map(f => [f, f])
                this.systemFonts = [[defaultFontFamily, defaultFontFamily + "（默认）"], ...localFonts]
            }
        },
        beforeUnmount() {
            window.removeEventListener("keydown", this.onKeyDown);
        },

        watch: {
            keyBindings(newKeyBindings) {
                this.updateSettings()
            }
        },

        computed: {
            ...mapStores(useSettingsStore),
        },

        methods: {
            onKeyDown(event) {
                if (event.key === "Escape" && !this.addKeyBindingDialogVisible) {
                    this.$emit("closeSettings")
                }
            },

            updateSettings() {
                this.settingsStore.updateSettings({
                    showLineNumberGutter: this.showLineNumberGutter,
                    showFoldGutter: this.showFoldGutter,
                    showWhitespace: this.showWhitespace,
                    showTabs: this.showTabs,
                    showTabsInFullscreen: this.showTabsInFullscreen,
                    keymap: this.keymap,
                    keyBindings: this.keyBindings.map((kb) => toRaw(kb)),
                    emacsMetaKey: window.heynote.platform.isMac ? this.metaKey : "alt",
                    allowBetaVersions: this.allowBetaVersions,
                    enableGlobalHotkey: this.enableGlobalHotkey,
                    globalHotkey: this.globalHotkey,
                    showInDock: this.showInDock,
                    showInMenu: this.showInMenu || !this.showInDock,
                    alwaysOnTop: this.alwaysOnTop,
                    autoUpdate: this.autoUpdate,
                    bracketClosing: this.bracketClosing,
                    indentType: this.indentType,
                    tabSize: this.tabSize,
                    bufferPath: this.bufferPath,
                    fontFamily: this.fontFamily === defaultFontFamily ? undefined : this.fontFamily,
                    fontSize: this.fontSize === defaultFontSize ? undefined : this.fontSize,
                    cursorBlinkRate: this.cursorBlinkRate,
                    defaultBlockLanguage: this.defaultBlockLanguage === "text" ? undefined : this.defaultBlockLanguage,
                    defaultBlockLanguageAutoDetect: this.defaultBlockLanguageAutoDetect === true ? undefined : this.defaultBlockLanguageAutoDetect,
                })
                if (!this.showInDock) {
                    this.showInMenu = true
                }
                if (this.theme != this.themeSetting) {
                    this.settingsStore.setTheme(this.theme)
                }
            },

            async selectBufferLocation() {
                const path = await window.heynote.buffer.selectLocation()
                if (path) {
                    this.bufferPath = path
                    this.updateSettings()
                }
            },

            onCustomBufferLocationChange() {
                if (!this.customBufferLocation) {
                    this.bufferPath = ""
                    this.updateSettings()
                }
            },
        }
    }
</script>

<template>
    <div class="settings">
        <div class="dialog">
            <div class="dialog-content">
                <nav class="sidebar">
                    <h1>设置</h1>
                    <ul>
                        <TabListItem 
                            name="通用" 
                            tab="general" 
                            :activeTab="activeTab" 
                            @click="activeTab = 'general'"
                        />
                        <TabListItem 
                            name="编辑" 
                            tab="editing"
                            :activeTab="activeTab" 
                            @click="activeTab = 'editing'"
                        />
                        <TabListItem 
                            name="外观" 
                            tab="appearance"
                            :activeTab="activeTab" 
                            @click="activeTab = 'appearance'"
                        />
                        <TabListItem 
                            name="快捷键" 
                            tab="keyboard-bindings" 
                            :activeTab="activeTab" 
                            @click="activeTab = 'keyboard-bindings'"
                        />
                        <TabListItem 
                            :name="isWebApp ? '版本' : '更新'" 
                            tab="updates" 
                            :activeTab="activeTab" 
                            @click="activeTab = 'updates'"
                        />
                    </ul>
                </nav>
                <div class="settings-content">
                    <TabContent tab="general" :activeTab="activeTab">
                        <div class="row" v-if="!isWebApp">
                            <div class="entry">
                                <h2>全局快捷键</h2>
                                <label class="keyboard-shortcut-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="enableGlobalHotkey" 
                                        @change="updateSettings"
                                    />
                                    启用全局快捷键
                                </label>
                                
                                <KeyboardHotkey 
                                    :disabled="!enableGlobalHotkey"
                                    v-model="globalHotkey"
                                    @change="updateSettings"
                                />
                            </div>
                        </div>
                        <div class="row" v-if="!isWebApp">
                            <div class="entry">
                                <h2>窗口 / 应用</h2>
                                <label v-if="isMac">
                                    <input
                                        type="checkbox"
                                        v-model="showInDock"
                                        @change="updateSettings"
                                    />
                                    在 Dock 中显示
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        :disabled="!showInDock"
                                        v-model="showInMenu"
                                        @change="updateSettings"
                                    />
                                    <template v-if="isMac">
                                        在菜单栏中显示
                                    </template>
                                    <template v-else>
                                        在系统托盘中显示
                                    </template>
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="alwaysOnTop"
                                        @change="updateSettings"
                                    />
                                    窗口置顶
                                </label>
                            </div>
                        </div>
                        <div class="row" v-if="!isWebApp">
                            <div class="entry buffer-location">
                                <h2>笔记文件路径</h2>
                                <label class="keyboard-shortcut-label">
                                    <input 
                                        type="checkbox" 
                                        v-model="customBufferLocation" 
                                        @change="onCustomBufferLocationChange"
                                    />
                                    自定义笔记文件的存储位置
                                </label>
                                <div class="file-path">
                                    <button
                                        :disabled="!customBufferLocation"
                                        @click="selectBufferLocation"
                                    >选择目录</button>
                                    <span class="path" v-show="customBufferLocation && bufferPath">{{ bufferPath }}</span>
                                </div>
                            </div>
                        </div>
                    </TabContent>

                    <TabContent tab="editing" :activeTab="activeTab">
                        <div class="row">
                            <div class="entry">
                                <h2>输入设置</h2>
                                <label>
                                    <input 
                                        type="checkbox"
                                        v-model="bracketClosing"
                                        @change="updateSettings"
                                    />
                                    自动闭合括号和引号
                                </label>
                            </div>  
                        </div>
                        <div class="row">
                            <div class="entry">
                                <h2>缩进宽度</h2>
                                <select v-model="tabSize" @change="updateSettings" class="tab-size">
                                    <option
                                        v-for="size in [1, 2, 3, 4, 5, 6, 7, 8]"
                                        :key="size"
                                        :selected="tabSize === size"
                                        :value="size"
                                    >{{ size }} 个空格</option>
                                </select>
                            </div>
                            <div class="entry">
                                <h2>缩进方式</h2>
                                <select v-model="indentType" @change="updateSettings" class="indent-type">
                                    <option value="space" :selected="indentType === 'space'">空格</option>
                                    <option value="tab" :selected="indentType === 'tab'">Tab 字符</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="entry">
                                <h2>默认区块语言</h2>
                                <select v-model="defaultBlockLanguage" @change="updateSettings" class="block-language">
                                    <template v-for="lang in languageOptions" :key="lang.value">
                                        <option :selected="lang.value === defaultBlockLanguage" :value="lang.value">{{ lang.name }}</option>
                                    </template>
                                </select>
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="defaultBlockLanguageAutoDetect"
                                        @change="updateSettings"
                                        class="language-auto-detect"
                                    />
                                    自动检测（默认开启）
                                </label>
                            </div>  
                        </div>
                    </TabContent>

                    <TabContent tab="appearance" :activeTab="activeTab">
                        <div class="row">
                            <div class="entry">
                                <h2>颜色主题</h2>
                                <select v-model="theme" @change="updateSettings" class="theme">
                                    <option :selected="theme === 'system'" value="system">跟随系统</option>
                                    <option :selected="theme === 'light'" value="light">浅色</option>
                                    <option :selected="theme === 'dark'" value="dark">深色</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="entry">
                                <h2>行号槽与空白字符</h2>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        v-model="showLineNumberGutter" 
                                        @change="updateSettings"
                                    />
                                    显示行号
                                </label>
                                
                                <label>
                                    <input 
                                        type="checkbox" 
                                        v-model="showFoldGutter" 
                                        @change="updateSettings"
                                    />
                                    显示折叠栏
                                </label>

                                <label>
                                    <input 
                                        type="checkbox" 
                                        v-model="showWhitespace" 
                                        @change="updateSettings"
                                    />
                                    显示空白字符
                                </label>
                            </div>
                        </div>
                        <div class="row font-settings">
                            <div class="entry">
                                <h2>字体</h2>
                                <select v-model="fontFamily" @change="updateSettings" class="font-family">
                                    <option
                                        v-for="[font, label] in systemFonts"
                                        :selected="font === fontFamily"
                                        :value="font"
                                    >{{ label }}</option>
                                </select>
                            </div>
                            <div class="entry">
                                <h2>字号</h2>
                                <select v-model="fontSize" @change="updateSettings" class="font-size">
                                    <option
                                        v-for="size in [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                                        :selected="size === fontSize"
                                        :value="size"
                                    >{{ size }}px{{ size === defaultFontSize ? "（默认）" : "" }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="entry">
                                <h2>光标闪烁频率</h2>
                                <select v-model.number="cursorBlinkRate" @change="updateSettings" class="cursor-blink-rate">
                                    <option :value="0">关闭</option>
                                    <option :value="250">250 ms</option>
                                    <option :value="500">500 ms</option>
                                    <option :value="750">750 ms</option>
                                    <option :value="1000">1000 ms（默认）</option>
                                    <option :value="1250">1250 ms</option>
                                    <option :value="1500">1500 ms</option>
                                    <option :value="2000">2000 ms</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="entry">
                                <h2>标签页</h2>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        v-model="showTabs" 
                                        @change="updateSettings"
                                    />
                                    显示标签页
                                </label>
                                
                                <label>
                                    <input 
                                        type="checkbox" 
                                        v-model="showTabsInFullscreen" 
                                        @change="updateSettings"
                                        :disabled="!showTabs"
                                    />
                                    全屏模式下显示标签页
                                </label>
                            </div>
                        </div>
                    </TabContent>

                    <TabContent tab="keyboard-bindings" :activeTab="activeTab">
                        <div class="row">
                            <div class="entry">
                                <h2>键位模式</h2>
                                <select v-model="keymap" @change="updateSettings" class="keymap">
                                    <template v-for="km in keymaps" :key="km.value">
                                        <option :selected="km.value === keymap" :value="km.value">{{ km.name }}</option>
                                    </template>
                                </select>
                            </div>
                            <div class="entry" v-if="keymap === 'emacs' && isMac">
                                <h2>Meta 键</h2>
                                <select v-model="metaKey" @change="updateSettings" class="metaKey">
                                    <option :selected="metaKey === 'meta'" value="meta">Command</option>
                                    <option :selected="metaKey === 'alt'" value="alt">Option</option>
                                </select>
                            </div>
                        </div>
                        <KeyboardBindings 
                            :userKeys="keyBindings ? keyBindings : {}"
                            v-model="keyBindings"
                            @addKeyBindingDialogVisible="addKeyBindingDialogVisible = $event"
                        />
                    </TabContent>
                    
                    <TabContent tab="updates" :activeTab="activeTab">
                        <div class="row">
                            <div class="entry">
                                <h2>当前版本</h2>
                                <b>{{ appVersion }}</b>
                            </div>
                        </div>

                        <div class="row" v-if="!isWebApp">
                            <div class="entry">
                                <h2>更新</h2>
                                <p class="pinned-note">
                                    本版本为汉化固定版本，已禁用自动更新，避免升级到官方版本后丢失汉化内容。
                                </p>
                            </div>
                        </div>
                    </TabContent>
                </div>
            </div>
            
            <div class="bottom-bar" :inert="addKeyBindingDialogVisible">
                <button 
                    @click="$emit('closeSettings')"
                    class="close"
                >关闭</button>
            </div>
        </div>
        <div class="shader"></div>
    </div>
</template>

<style lang="sass" scoped>
    .settings
        z-index: 500 // above the search panel and other overlays
        position: fixed
        top: 0
        left: 0
        bottom: 0
        right: 0

        .shader
            z-index: 1
            position: absolute
            top: 0
            left: 0
            bottom: 0
            right: 0
            background: rgba(0, 0, 0, 0.5)
        
        .dialog
            --dialog-height: 600px
            --bottom-bar-height: 48px
            box-sizing: border-box
            z-index: 2
            position: absolute
            left: 50%
            top: 50%
            transform: translate(-50%, -50%)
            width: 820px
            height: var(--dialog-height)
            max-width: 100%
            max-height: 100%
            display: flex
            flex-direction: column
            border-radius: 5px
            background: #fff
            color: #333
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.2)
            overflow-y: auto
            &:active, &:selected, &:focus, &:focus-visible
                border: none
                outline: none
            +dark-mode
                background: #333
                color: #eee
                box-shadow: 0 0 25px rgba(0, 0, 0, 0.3)
            .dialog-content
                flex-grow: 1
                display: flex
                height: calc(var(--dialog-height) - var(--bottom-bar-height))
                .sidebar
                    box-sizing: border-box
                    width: 140px
                    border-right: 1px solid #eee
                    padding-top: 20px
                    +dark-mode
                        border-right: 1px solid #222
                    h1
                        font-size: 16px
                        font-weight: 700
                        margin-bottom: 20px
                        padding: 0 20px
                        margin-bottom: 20px
                .settings-content
                    flex-grow: 1
                    padding: 40px
                    overflow-y: auto
                    position: relative
                    .pinned-note
                        font-size: 12px
                        line-height: 1.6
                        color: rgba(0,0,0, 0.55)
                        +dark-mode
                            color: rgba(255,255,255, 0.55)
                    select
                        height: 22px
                        margin: 4px 0
                        font-family: inherit
                        font-size: 12px
                        font-weight: normal
                        color: inherit
                        background: #fff
                        border: 1px solid #c5c5c5
                        border-radius: 3px
                        &:focus
                            outline: none
                            border-color: #48b57e
                        +dark-mode
                            background: #3b3b3b
                            color: rgba(255,255,255, 0.9)
                            border-color: #5a5a5a
                        option
                            font-family: inherit
                            font-size: 12px
                            font-weight: normal
                            background: #fff
                            color: #333
                            +dark-mode
                                background: #3b3b3b
                                color: rgba(255,255,255, 0.9)
                    .row
                        display: flex
                        .entry
                            margin-bottom: 24px
                            margin-right: 20px
                            &:last-child
                                margin-right: 0
                            h2
                                font-weight: 600
                                margin-bottom: 10px
                                font-size: 14px
                            select
                                width: 200px
                                &:focus
                                    outline: none
                            label
                                display: block
                                user-select: none
                                &.keyboard-shortcut-label
                                    margin-bottom: 14px
                                > input[type=checkbox]
                                    position: relative
                                    top: 2px
                                    left: -3px
                        &.font-settings
                            display: flex
                            .font-family
                                width: 280px
                            .font-size
                                width: 120px
                        
                        .buffer-location 
                            width: 100%
                            .file-path
                                display: flex
                                > button
                                    flex-shrink: 0
                                    padding: 3px 8px
                                .path
                                    flex-grow: 1
                                    margin-left: 10px
                                    font-size: 12px
                                    font-family: "Hack"
                                    padding: 5px 8px
                                    border-radius: 3px
                                    background: #f1f1f1
                                    color: #555
                                    white-space: nowrap
                                    overflow-x: auto
                                    +dark-mode
                                        background: #222
                                        color: #aaa
            .bottom-bar
                box-sizing: border-box
                height: var(--bottom-bar-height)
                border-radius: 0 0 5px 5px
                background: #eee
                text-align: right
                padding: 10px 20px
                +dark-mode
                    background: #222
                .close
                    height: 28px
                    cursor: pointer
</style>
