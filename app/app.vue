<script setup lang="ts">
import WordsListProvider from './provider/WordsListProvider'

useHead({
  title: 'dictionary',
  meta: [{ name: 'description', content: '英语单词小抄' }],
})
</script>

<template>
  <UApp>
    <WordsListProvider>
      <NuxtLayout>
        <!-- router-view 入口？ -->
        <NuxtPage />
      </NuxtLayout>
    </WordsListProvider>
  </UApp>
</template>
