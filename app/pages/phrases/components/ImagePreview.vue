<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  image: string
}>()

const showPreview = ref(false)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') showPreview.value = false
}
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div class="group relative w-full">
    <!-- 小图区域 -->
    <div
      class="relative cursor-pointer overflow-hidden rounded-lg"
      @click="showPreview = true"
    >
      <img
        :src="image"
        alt="短语配图"
        class="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        style="max-height: 600px"
      />

      <!-- 上下渐变阴影 -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-linear-to-b from-black/20 to-transparent"
      ></div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black/20 to-transparent"
      ></div>

      <!-- hover 提示层 -->
      <div
        class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div
          class="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-sm text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          点击预览
        </div>
      </div>
    </div>

    <!-- 预览层 -->
    <transition name="fade">
      <div
        v-if="showPreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click.self="showPreview = false"
      >
        <div class="relative max-h-[90vh] max-w-[90vw]">
          <img
            :src="image"
            alt="预览图"
            class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
          <button
            class="absolute -top-3 -right-3 rounded-full bg-black/70 px-3 py-1 text-sm text-white hover:bg-black"
            @click="showPreview = false"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
