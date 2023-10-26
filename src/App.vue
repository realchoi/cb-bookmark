<script setup lang="ts">
// import UsePiniaDemo from './components/UsePiniaDemo.vue'
import useMessage from '@/components/UseMessage.vue'
</script>

<template>
  <n-dialog-provider>
    <n-message-provider>
      <useMessage />
    </n-message-provider>
  </n-dialog-provider>

  <!-- <UsePiniaDemo /> -->
  <RouterView />
</template>

<style scoped></style>
