/**
 * 设置 localstorage 键值对
 * @param key 键
 * @param value 值
 */
export const setLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 获取 localstorage 的值
 * @param key 键
 */
export const getLocalStorage = (key: string) => {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : {}
}

/**
 * 移除 localstorage 的值
 * @param key 键
 */
export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key)
}