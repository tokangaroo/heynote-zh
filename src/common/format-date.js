export function formatDate(date, locale) {
    const now = new Date();

    // normalize to local midnight for date-only comparison
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfGiven = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((startOfToday - startOfGiven) / (1000 * 60 * 60 * 24));

    // Today: show just time
    if (diffDays === 0) {
        return date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // Yesterday: show "<Yesterday>, <time>"（按区域设置本地化，如 zh-CN 显示"昨天"）
    if (diffDays === 1) {
        const time = date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit"
        });
        let yesterday = "Yesterday";
        try {
            yesterday = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-1, "day");
        } catch (e) {
            // 区域设置不支持时回退到英文
        }
        return `${yesterday} ${time}`;
    }

    // Otherwise: full date + time, omit year if same
    const sameYear = date.getFullYear() === now.getFullYear();

    return date.toLocaleString(locale, {
        year: sameYear ? undefined : "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function formatFullDate(date, locale) {
    return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function formatFullDateWithoutSeconds(date, locale) {
    return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
     });
}
