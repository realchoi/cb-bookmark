<script setup lang="ts">
// import UsePiniaDemo from './components/UsePiniaDemo.vue'
import useMessage from '@/components/UseMessage.vue'
import CommonLayout from "./components/layout/CommonLayout.vue"
</script>

<template>
  <n-dialog-provider>
    <n-message-provider>
      <useMessage />
    </n-message-provider>
  </n-dialog-provider>

  <!-- <UsePiniaDemo /> -->
  <!-- <RouterView /> -->
  <CommonLayout></CommonLayout>
</template>

<style scoped></style>
