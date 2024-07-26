<script setup lang="ts">
useHead({
  title: 'linzhe dictionary',
  meta: [{ name: 'description', content: '英语单词小抄' }],
})
</script>

<template>
  <NuxtLayout>
    <!-- router-view 入口？ -->
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>
