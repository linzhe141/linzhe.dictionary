<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const router = useRouter()

interface Phrase {
  id: string
  image?: string
  source?: string
  content: string
  createdAt: Date
}

// 短语列表
const phrases = ref<Phrase[]>([
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    source: 'F1 赛事',
    content: `I hereby announce my retirement form formula one by the end of the 2022 season
^ 特地，在此`,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    content: `But as much as there is life on track, there is my life off track too
^^^^^^^^^^^但是不仅`,
    createdAt: new Date('2024-01-14'),
  },
])

// 格式化日期
const formatDate = (date: Date) => {
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
const editPhrase = (id: string) => {
  router.push(`/phrases/${id}/edit`)
}

// 删除短语
const deletePhrase = (id: string) => {
  // 这里添加删除逻辑
  phrases.value = phrases.value.filter((p) => p.id !== id)
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
        <h1 class="text-lg font-semibold">我的短语</h1>
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
    <div class="p-4">
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
            <img
              :src="phrase.image"
              alt="短语配图"
              class="w-full rounded-lg object-cover"
              style="max-height: 200px"
            />
            <p v-if="phrase.source" class="mt-2 text-sm text-gray-400">
              出处: {{ phrase.source }}
            </p>
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
              <UButton
                variant="ghost"
                size="xs"
                icon="i-heroicons-trash"
                @click="deletePhrase(phrase.id)"
              >
                删除
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
