<template>
    <div>{{ userStore.userInfo.userName }}</div>
    <n-button strong secondary type="primary" @click="handleClick">
        更改姓名
    </n-button>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const handleClick = () => {
    userStore.setUserInfo({
        /**用户 Id，关联 user_info 表的主键 */
        id: '1',
        /**登录类型 */
        identityType: 1,
        /**标识（手机号、邮箱、用户名或第三方应用的唯一标识） */
        identifier: '123',
        /**用户名（唯一） */
        userName: 'testUser',
        /**昵称 */
        nickName: 'testUser',
        /**头像 URL */
        avatar: '1'
    })
}
</script>