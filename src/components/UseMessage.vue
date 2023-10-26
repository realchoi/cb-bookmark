<template></template>

<script lang="ts" setup>
import { useMessage, useDialog } from 'naive-ui'

// 关键代码，将 message 挂载到全局 window 上面
window.$message = useMessage()
window.$dialog = useDialog()
</script>
