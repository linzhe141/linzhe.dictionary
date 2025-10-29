<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function routerBack() {
  if (
    window.history.state.back &&
    !window.history.state.back.includes('login')
  ) {
    router.back()
  } else {
    router.push('/home')
  }
}
</script>

<template>
  <div
    class="flex cursor-pointer items-center justify-center rounded-full p-1 hover:bg-[#181919]"
  >
    <UIcon
      class="size-6"
      name="i-heroicons-arrow-long-left"
      @click="routerBack"
    />
  </div>
</template>
