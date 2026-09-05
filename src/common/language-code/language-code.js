import LANG_DATA from "./iso-639-1.json"

const LANGUAGE_NAMES = Object.fromEntries(LANG_DATA.map(l => [l.code, l.name]))

// 使用 Intl.DisplayNames 将语言代码显示为本地化名称（如 en → 中文），失败时回退到英文名称
let displayNames = null
try {
    displayNames = new Intl.DisplayNames(["zh-CN"], { type: "language" })
} catch (e) {
    displayNames = null
}

export function getLanguageName(code) {
    const shortCode = code.substring(0, 2)
    let name = LANGUAGE_NAMES[shortCode]
    if (displayNames) {
        const localizedName = displayNames.of(shortCode)
        if (localizedName && localizedName !== shortCode) {
            name = localizedName
        }
    }
    if (name) {
        return `${name} (${code})`
    } else {
        return code
    }
}
