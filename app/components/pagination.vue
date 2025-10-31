<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalItems: number
  pageSize?: number
}>()
const currentPage = defineModel<number>('current', { required: true })
const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const pageSize = computed(() => props.pageSize ?? 10)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / pageSize.value)),
)

// 翻页逻辑
function goToPage(page: number) {
  const target = Math.min(Math.max(1, page), totalPages.value)
  if (target !== currentPage.value) {
    currentPage.value = target
    emit('update:page', target)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <UButton
      variant="outline"
      size="sm"
      icon="i-heroicons-chevron-left"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
    </UButton>

    <div class="flex gap-0.5">
      <!-- 第一页 -->
      <UButton
        v-if="currentPage > 3"
        variant="ghost"
        size="sm"
        @click="goToPage(1)"
      >
        1
      </UButton>
      <span v-if="currentPage > 4" class="flex items-center px-2">...</span>

      <!-- 当前页附近的页码 -->
      <template v-for="page in totalPages" :key="page">
        <UButton
          v-if="Math.abs(page - currentPage) <= 2"
          :variant="page === currentPage ? 'solid' : 'ghost'"
          size="sm"
          @click="() => goToPage(page)"
        >
          {{ page }}
        </UButton>
      </template>

      <!-- 最后一页 -->
      <span v-if="currentPage < totalPages - 3" class="flex items-center px-2"
        >...</span
      >
      <UButton
        v-if="currentPage < totalPages - 2"
        variant="ghost"
        size="sm"
        @click="() => goToPage(totalPages)"
      >
        {{ totalPages }}
      </UButton>
    </div>

    <UButton
      variant="outline"
      size="sm"
      icon="i-heroicons-chevron-right"
      :disabled="currentPage === totalPages"
      @click="() => goToPage(currentPage + 1)"
    >
    </UButton>
  </div>
</template>
