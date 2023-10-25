<template></template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'

// 关键代码，将 message 挂在到全局 window 上面
window.$message = useMessage()
</script>
