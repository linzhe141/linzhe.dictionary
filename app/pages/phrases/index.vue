<script setup lang="ts">
import ImagePreview from './components/ImagePreview.vue'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()

const { data: phrases, refresh } = await useFetch('/api/phrases')
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

const open = ref(false)
// 删除短语
const deletePhrase = (id: number) => {
  // 这里添加删除逻辑
  open.value = false
}
</script>

<template>
  <div
    class="mx-auto min-h-screen max-w-[842px] border-r border-l border-[#2f3336] pb-4"
  >
    <!-- 顶部导航栏 -->
    <div
      class="flex h-14 items-center justify-between border-b border-[#2f3336] px-4"
    >
      <div class="flex items-center gap-4">
        <UIcon
          name="i-heroicons-arrow-long-left"
          class="size-6 cursor-pointer hover:text-gray-300"
          @click="() => router.push('/home')"
        />
        <h1 class="text-lg font-semibold">短语 / 口语搭配</h1>
      </div>
      <UButton
        color="primary"
        size="sm"
        icon="i-heroicons-plus"
        @click="goToCreate"
      >
        创建短语
      </UButton>
    </div>

    <!-- 短语列表 -->
    <div v-if="phrases" class="p-4">
      <div
        v-if="phrases.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-heroicons-document-text"
          class="mb-4 size-16 text-gray-600"
        />
        <p class="mb-2 text-gray-400">还没有短语</p>
        <p class="mb-4 text-sm text-gray-500">点击右上角创建你的第一个短语</p>
      </div>

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
          <div
            class="mb-3 font-mono text-sm leading-relaxed whitespace-pre-wrap"
          >
            {{ phrase.content }}
          </div>

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
              <UModal v-model:open="open" prevent-close>
                <UButton
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="open = true"
                >
                  删除
                </UButton>
                <template #content>
                  <div class="p-2">是否删除该短语？</div>
                  <div class="mt-4 flex justify-end gap-2 p-2">
                    <UButton variant="outline" @click="open = false">
                      取消
                    </UButton>
                    <UButton
                      @click="
                        () => {
                          deletePhrase(phrase.id)
                        }
                      "
                    >
                      删除
                    </UButton>
                  </div>
                </template>
              </UModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
