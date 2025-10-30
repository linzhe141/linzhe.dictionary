<script setup lang="ts">
import { VueMarkdownRenderer } from 'vue-mdr'

defineProps<{
  content: string
}>()
</script>

<template>
  <div class="prose dark:prose-invert prose-sm max-w-none font-mono">
    <VueMarkdownRenderer :source="content" theme="dark"></VueMarkdownRenderer>
  </div>
</template>
