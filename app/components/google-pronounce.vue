<script setup lang="ts">
defineProps<{
  word: string
}>()
</script>

<template>
  <ULink
    target="_blank"
    :href="`https://www.google.com/search?q=${word} 怎么发音`"
    class="flex items-center hover:text-green-400"
  >
    <UIcon name="bx:bxl-google"></UIcon>
    发音</ULink
  >
</template>
