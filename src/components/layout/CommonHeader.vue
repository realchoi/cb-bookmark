<template>
    <div class="header">
        <!-- logo 区域 start -->
        <div class="flex w-45px h-45px py-4">
            <a class="flex items-center justify-center cursor-pointer w-full h-full" @click="gotoPath('/')" title="首页">
                <div class="w-full h-full"
                    style="background-size: 45px 45px; background-image: url(https://s3.bmp.ovh/imgs/2023/10/26/15b0f012af94d69b.png);">
                </div>
            </a>
        </div>
        <!-- logo 区域 end -->
        <!-- 菜单区域 start -->
        <div class="flex items-center flex-1">
            <!-- 功能菜单 start -->
            <div class="menu" ref="menuRef">
                <a class="menu-item" :class="{ highlight: activePath.indexOf(item.path) >= 0 }"
                    @click="selectMenu(item.path)" :key="item.name" v-for="item in menus">{{ item.name }}</a>
            </div>
            <div class="hamburger" ref="hamburgerRef" @click="openMobileMenu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <!-- 功能菜单 end -->
            <!-- 用户信息菜单 start -->
            <div class="flex ml-auto">
                <div class="flex" v-if="!userStore.loginStatus">
                    <button class="btn btn-login" @click="gotoPath('/login')">
                        登录
                    </button>
                    <button class="btn btn-register" style="margin-left: 10px;" @click="gotoPath('/register')">
                        注册
                    </button>
                </div>
                <n-dropdown trigger="hover" :options="dropdownMenuOptions" v-else>
                    <n-button quaternary type="primary">用户：{{ userStore.userInfo.userName }}</n-button>
                </n-dropdown>
            </div>
            <!-- 用户信息菜单 end -->
        </div>
        <!-- 菜单区域 end -->
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { gotoPath } from '@/utils/routerUtil'
import { menus } from '@/configs/menuConfig'
import { removeLocalStorage } from '@/utils/localStorage'
import type { UserInfoDto } from '@/models/accounts/userModel'

const router = useRouter()
const userStore = useUserStore()
const route = useRoute()

const menuRef = ref<HTMLElement>()
const hamburgerRef = ref<HTMLElement>()

const dropdownMenuOptions = [{
    label: '我的主页',
    key: 'user_profile',
    disabled: false,
    props: {
        onClick: () => {
            gotoPath('/member')
        }
    }
}, {
    label: '退出登录',
    key: 'user_logout',
    disabled: false,
    props: {
        onClick: () => {
            window.$message.success('退出登录成功！')
            logout()
        }
    }
}]

/**
 * 当前选中的菜单的 path
 */
const activePath = computed(() => route.path)

/**
 * 选择某个菜单
 * @param path 菜单的 path
 */
const selectMenu = (path: string) => {
    closeMobileMenu()
    if (route.path !== path)
        gotoPath(path)
}

/**
 * 打开移动端菜单
 */
const openMobileMenu = () => {
    hamburgerRef.value?.classList.toggle("active")
    menuRef.value?.classList.toggle("active")
}

/**
 * 关闭移动端菜单
 */
const closeMobileMenu = () => {
    hamburgerRef.value?.classList.remove("active")
    menuRef.value?.classList.remove("active")
}

/**
 * 退出登录
 */
const logout = () => {
    removeLocalStorage('accessToken')
    userStore.setLoginStatus(false)
    userStore.setUserInfo({} as UserInfoDto)
    router.replace('/')
}
</script>

<style scoped>
.header {
    @apply flex items-center box-border w-full h-16 px-16 py-2 bg-#eff0f3;
    /* 边框样式 */
    /* @apply border-b-2px border-b-#ff8ca8; */
}

.menu {
    @apply flex items-center text-base;
}

.menu-item {
    @apply cursor-pointer duration-800 px-2 py-1 ml-4 rounded-0.5 color-#0d0d0d hover-bg-#ff8e3c;
}

.highlight {
    @apply color-#0d0d0d bg-#ff8e3c;
}

.btn {
    @apply flex items-center justify-center h-32px text-14px box-border;
    @apply font-bold leading-1.5715 whitespace-nowrap outline-none cursor-pointer;
    @apply py-0.5rem px-1rem rounded-0.125rem duration-800;
    @apply hover-shadow-lg hover-bg-#ff8e3c;
}

.btn-login {
    @apply bg-#fff color-#0d0d0d border-1px border-#ff8e3c;
}

.btn-register {
    @apply bg-#ff8e3c color-#0d0d0d border-none;
}

.hamburger {
    display: none;
}

.bar {
    @apply block w-25px h-3px my-5px mx-auto bg-#0d0d0d;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}

/* ==================== 响应式 ======================= */
@media only screen and (max-width: 768px) {
    .menu {
        @apply fixed -left-100% py-4 top-4rem flex-col bg-#eff0f3 w-100% text-center z-1 duration-300;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
    }

    .menu.active {
        left: 0;
    }

    .menu-item {
        margin: 0.25rem 0;
    }

    .hamburger {
        @apply block cursor-pointer;
    }

    /**点击汉堡菜单时呈现一个 "X" */
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
}
</style>