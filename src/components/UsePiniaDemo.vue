<template>
    <div>{{ userStore.name }}</div>
    <n-button strong secondary type="primary" @click="handleClick">
        更改姓名
    </n-button>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const handleClick = () => {
    userStore.updateName('李四')
}
</script>