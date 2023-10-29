/**
 * 自定义 pinia 持久化插件
 */

import { toRaw } from 'vue'
import type { PiniaPluginContext } from 'pinia'
import { getLocalStorage, setLocalStorage } from '@/utils/localStorage'

type Options = {
    key?: string
}

const __piniaKey__: string = 'cb-bookmark'

export const piniaPlugin = (options: Options) => {
    return (context: PiniaPluginContext) => {
        // context 里封装了 store 等数据
        const { store } = context
        // 存储到 localstorage 的键
        const key = `${options?.key ?? __piniaKey__}-${store.$id}`
        // 从 localstorage 获取 store 的值
        const data = getLocalStorage(key)
        // 订阅 store 的改变
        store.$subscribe(() => {
            setLocalStorage(key, toRaw(store.$state))
        })
        // 返回给 store
        return {
            ...data
        }
    }
}