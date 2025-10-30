<script setup lang="ts">
import ImagePreview from './components/ImagePreview.vue'
import ViewContent from './components/ViewContent.vue'

definePageMeta({
  layout: 'phrases-layout',
  middleware: 'auth',
  keepalive: true,
})

const router = useRouter()
const route = useRoute()

// 从 URL 获取初始页码
const currentPage = ref(Number(route.query.page) || 1)
const pageSize = 10

const {
  data: phrasesData,
  pending,
  refresh,
} = await useFetch(
  () => `/api/phrases?page=${currentPage.value}&limit=${pageSize}`,
)

// 计算属性
const phrases = computed(() => phrasesData.value?.data || [])
const total = computed(() => phrasesData.value?.total || 0)

// 监听 URL 变化，更新当前页
watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1
    if (page !== currentPage.value) {
      currentPage.value = page
    }
  },
)

// 格式化日期
const formatDate = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 跳转到创建页面
const goToCreate = () => {
  router.push('/phrases/add')
}

// 编辑短语
const editPhrase = (id: number) => {
  router.push(`/phrases/edit/${id}`)
}

// 删除相关
const deleteDialogOpen = ref(false)
const phraseToDelete = ref<number | null>(null)

const openDeleteDialog = (id: number) => {
  phraseToDelete.value = id
  deleteDialogOpen.value = true
}

// 删除短语
const deletePhrase = async () => {
  if (!phraseToDelete.value) return

  try {
    // TODO: 调用删除接口
    await $fetch(`/api/phrases/${phraseToDelete.value}`, {
      // @ts-expect-error todo
      method: 'DELETE',
    })

    // 刷新当前页数据
    await refresh()

    deleteDialogOpen.value = false
    phraseToDelete.value = null
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 翻页 - 更新 URL
const goToPage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  })

  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'auto' })
}
</script>

<template>
  <div>
    <div class="sticky top-14 z-10 mb-4 flex justify-end bg-black/80 p-4 py-3">
      <UButton
        color="primary"
        size="sm"
        icon="i-heroicons-plus"
        @click="goToCreate"
      >
        创建短语
      </UButton>
    </div>

    <!-- 加载状态 -->
    <div v-if="pending && !phrases.length" class="flex justify-center p-8">
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-8 animate-spin text-gray-400"
      />
    </div>

    <div v-else class="p-4">
      <div
        v-if="phrases.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon name="i-heroicons-document-text" class="mb-4 size-16" />
        <p class="mb-2">还没有短语</p>
        <p class="mb-4 text-sm">点击右上角创建你的第一个短语</p>
      </div>

      <!-- 短语列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="phrase in phrases"
          :key="phrase.id"
          class="rounded-lg border border-[#2f3336] bg-[#16181c] p-4 transition-colors hover:bg-[#1a1d23]"
        >
          <!-- 图片 -->
          <div v-if="phrase.image" class="mb-4">
            <ImagePreview :image="phrase.image" />
          </div>

          <!-- 短语内容 -->
          <ViewContent class="mb-3" :content="phrase.content" />

          <!-- 底部信息 -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ formatDate(phrase.createdAt) }}</span>
            <div class="flex items-center gap-2">
              <UButton
                variant="ghost"
                size="xs"
                icon="i-heroicons-pencil-square"
                @click="editPhrase(phrase.id)"
              >
                编辑
              </UButton>
              <UButton
                variant="ghost"
                size="xs"
                icon="i-heroicons-trash"
                @click="openDeleteDialog(phrase.id)"
              >
                删除
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        class="mt-6"
        :total-items="total"
        :page-size="pageSize"
        :current="currentPage"
        @update:page="goToPage"
      ></Pagination>
    </div>

    <!-- 删除确认对话框 -->
    <UModal v-model:open="deleteDialogOpen" prevent-close>
      <template #content>
        <div class="p-6">
          <h3 class="mb-4 text-lg font-semibold">TODO 确认删除</h3>
          <p class="text-gray-400">是否删除该短语？此操作无法撤销。</p>
          <div class="mt-6 flex justify-end gap-2">
            <UButton variant="outline" @click="deleteDialogOpen = false">
              取消
            </UButton>
            <UButton @click="deletePhrase"> 删除 </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
