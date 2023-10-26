import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

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

export default router