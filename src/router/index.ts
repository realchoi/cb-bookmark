import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import { useUserStore } from '@/store/user'  // 使用 Pinia 存储用户状态
import { createDiscreteApi } from 'naive-ui'  // 用于显示提示信息

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Index',
        meta: {
            title: '首页',
            keepAlive: true,
            requireAuth: true
        },
        component: () => import('@/views/Index.vue')
    },
    {
        path: '/import',
        name: 'Import',
        meta: {
            title: '导入书签',
            keepAlive: true,
            requireAuth: true
        },
        component: () => import('@/views/ImportBookmarkItem.vue')
    },
    {
        path: '/export',
        name: 'Export',
        meta: {
            title: '导出书签',
            keepAlive: true,
            requireAuth: true
        },
        component: () => import('@/views/ExportBookmarkItem.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
            keepAlive: true,
            requireAuth: false
        },
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {
            title: '注册',
            keepAlive: true,
            requireAuth: false
        },
        component: () => import('@/views/Register.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const { message } = createDiscreteApi(['message'])

router.beforeEach((to, from, next) => {
    console.log('from', from)
    console.log('to', to)
    const userStore = useUserStore()

    // 判断该路由是否需要登录权限
    if (to.meta.requireAuth) {
        // 判断用户是否已登录
        if (userStore.loginStatus && userStore.userInfo && userStore.userInfo.id) {
            next()
        } else {
            message.error('请先登录后再使用')
            next('/login')
        }
    } else {
        // 不需要认证的路由直接放行
        next()
    }
})

export default router