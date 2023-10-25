<script setup lang="ts">
// import UsePiniaDemo from './components/UsePiniaDemo.vue'
import useMessage from '@/components/UseMessage.vue'
</script>

<template>
  <n-message-provider>
    <useMessage />
  </n-message-provider>

  <!-- <UsePiniaDemo /> -->
  <RouterView />
</template>

<style scoped></style>
