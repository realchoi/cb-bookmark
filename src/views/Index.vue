<template>
    <h2>首页</h2>
    <div>
        <h4>用户信息：</h4>{{ userStore.userInfo.userName ? userStore.userInfo.userName : '无' }}，<h4>是否已登录：</h4>{{
            userStore.logState ? '是' : '否' }}
        <n-button strong tertiary type="primary" @click="handleLogout">
            登出
        </n-button>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { removeLocalStorage } from '@/utils/localStorage'
import type { UserInfoDto } from '@/models/accounts/userModel'

const userStore = useUserStore()

const handleLogout = () => {
    removeLocalStorage('accessToken')
    userStore.setLogState(false)
    userStore.setUserInfo({} as UserInfoDto)
    // router.replace('/')
}
</script>