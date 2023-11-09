import type { MenuItem } from '@/models/common/menuItem'

/**
 * 菜单项配置
 */
export const menus: MenuItem[] = [
    {
        name: "我的书签",
        path: ""
    },
    {
        name: "导入书签",
        path: "/import"
    },
    {
        name: "导出书签",
        path: "/export"
    },
    {
        name: "免费工具导航",
        path: "/free"
    }
]