<template>
    <div>
        <h2>用户信息：</h2>{{ userStore.userInfo.userName ? userStore.userInfo.userName : '无' }}，<h2>是否已登录：</h2>{{
            userStore.logState ? '是' : '否' }}
        <n-button strong tertiary type="primary" @click="handleLogout" v-if="userStore.logState">
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