import router from '@/router'
/**
 * 页面跳转
 * @param path 跳转地址
 */
export const gotoPath = (path: string) => {
    path = path.startsWith('/') ? path : `/${path}`
    router.push(path)
}