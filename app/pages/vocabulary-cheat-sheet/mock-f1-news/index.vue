<script setup lang="ts">
import F1Content from './f1-content.vue'
</script>

<template>
  <div class="flex items-center justify-center overflow-hidden">
    <div class="mb-40 w-[1100px]">
      <ClientOnly>
        <F1Content></F1Content>
      </ClientOnly>
      <LogoLink
        class="fixed top-[100px] -translate-x-[300px] rotate-90"
      ></LogoLink>
    </div>
  </div>
</template>
