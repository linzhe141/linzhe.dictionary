<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import ImagePreview from './ImagePreview.vue'

const props = defineProps<{
  mode: 'add' | 'edit'
  phraseId?: string
}>()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const router = useRouter()
const toast = useToast()

interface PhraseForm {
  image: File | null
  imagePreview: string
  content: string
}

const form = reactive<PhraseForm>({
  image: null,
  imagePreview: '',
  content: '',
})

const showPreview = ref(false)
const fileInputRef = ref<HTMLInputElement>()

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: '错误',
        description: '图片大小不能超过5MB',
      })
      return
    }

    form.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      form.imagePreview = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 移除图片
const removeImage = () => {
  form.image = null
  form.imagePreview = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items || items.length === 0) return
  const item = items[0]!
  if (item.type.startsWith('image/')) {
    const file = item.getAsFile()
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.add({
          title: '错误',
          description: '图片大小不能超过5MB',
        })
        return
      }

      form.image = file
      const reader = new FileReader()
      reader.onload = (e) => {
        form.imagePreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

// 监听粘贴
onMounted(() => {
  window.addEventListener('paste', handlePaste)
  if (props.mode === 'edit' && props.phraseId) {
    loadPhrase(props.phraseId)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('paste', handlePaste)
})

const loadPhrase = async (id: string) => {
  try {
    const data = await $fetch(`/api/phrases/${id}`)
    if (data == null) {
      throw new Error('短语不存在')
    }
    form.content = data.content || ''
    form.imagePreview = data.image || ''
  } catch (e) {
    toast.add({
      title: '错误',
      description: '加载短语失败',
    })
  }
}

const savePhrase = async () => {
  if (!form.content.trim()) {
    toast.add({
      title: '提示',
      description: '请输入短语内容',
    })
    return
  }

  try {
    let imagePath = null
    if (form.image) {
      const { pathname } = await uploadImage(form.image)
      imagePath = pathname ? `/images/${pathname}` : null
    } else if (form.imagePreview.startsWith('/images/')) {
      imagePath = form.imagePreview
    }

    if (props.mode === 'add') {
      await $fetch('/api/phrases', {
        method: 'POST',
        body: {
          content: form.content,
          image: imagePath,
        },
      })
      toast.add({
        title: '成功',
        description: '短语创建成功',
      })
    } else {
      await $fetch(`/api/phrases/${props.phraseId}`, {
        method: 'PATCH',
        body: {
          content: form.content,
          image: imagePath,
        },
      })
      toast.add({
        title: '成功',
        description: '短语更新成功',
      })
    }

    emit('saved')
  } catch (error) {
    toast.add({
      title: '错误',
      description: '保存失败，请重试',
    })
  }
}
</script>

<template>
  <div
    class="mx-auto min-h-screen max-w-[842px] border-r border-l border-[#2f3336] pb-4"
  >
    <!-- 顶部导航栏 -->
    <div
      class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#2f3336] bg-black/80 px-4 backdrop-blur-sm"
    >
      <div class="flex items-center gap-4">
        <UIcon
          name="i-heroicons-arrow-long-left"
          class="size-6 cursor-pointer hover:text-gray-300"
          @click="() => router.go(-1)"
        />
        <h1 class="text-lg font-semibold">
          {{ props.mode === 'add' ? '创建短语' : '编辑短语' }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          size="sm"
          :icon="showPreview ? 'i-heroicons-pencil-square' : 'i-heroicons-eye'"
          @click="togglePreview"
        >
          {{ showPreview ? '编辑' : '预览' }}
        </UButton>
        <UButton
          color="primary"
          size="sm"
          :disabled="!form.content"
          @click="savePhrase"
        >
          保存
        </UButton>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="showPreview" class="p-6">
      <div
        class="hover:bg-[#1a1d23 rounded-lg border border-[#2f3336] bg-[#16181c] p-4 transition-colors"
      >
        <div v-if="form.imagePreview" class="mb-6">
          <ImagePreview :image="form.imagePreview" />
        </div>
        <div class="mb-3 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {{ form.content || '短语内容将在这里显示' }}
        </div>
      </div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="p-6">
      <div class="space-y-6">
        <!-- 图片上传区域 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            配图（可选）
          </label>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />

          <div
            v-if="!form.imagePreview"
            class="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2f3336] bg-[#16181c] py-12 transition-colors hover:border-gray-500"
            @click="triggerFileInput"
          >
            <UIcon
              name="i-heroicons-photo"
              class="mb-2 size-12 text-gray-500"
            />
            <p class="text-sm text-gray-400">点击上传图片或直接粘贴图片</p>
            <p class="mt-1 text-xs text-gray-500">支持 JPG、PNG，最大 5MB</p>
          </div>

          <div v-else class="relative">
            <img
              :src="form.imagePreview"
              alt="预览"
              class="w-full rounded-lg object-cover"
              style="max-height: 300px"
            />
            <UButton
              icon="i-heroicons-x-mark"
              size="sm"
              variant="solid"
              class="absolute top-2 right-2"
              @click="removeImage"
            />
          </div>
        </div>

        <!-- 短语内容 -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-300">
            短语内容 <span class="text-red-500">*</span>
          </label>
          <UTextarea
            v-model="form.content"
            class="w-full font-mono"
            placeholder="在此输入短语内容..."
            :rows="8"
            size="lg"
            autoresize
          />
        </div>

        <!-- 提示 -->
        <UAlert
          icon="i-heroicons-information-circle"
          variant="soft"
          title="使用提示"
          description="你可以使用 ^ 符号标注翻译，换行分段，或者使用任何你喜欢的方式来组织内容。"
        />
      </div>
    </div>
  </div>
</template>
