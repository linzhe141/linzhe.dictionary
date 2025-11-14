<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'

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

const loading = ref(false)
const savePhrase = async () => {
  if (loading.value) return
  if (!form.content.trim()) {
    toast.add({
      color: 'warning',
      title: '提示',
      description: '请输入短语内容',
    })
    return
  }

  try {
    loading.value = true
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
    router.back()
    emit('saved')
  } catch (error) {
    toast.add({
      color: 'error',
      title: '错误',
      description: '保存失败，请重试',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="p-6">
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
            style="height: 300px"
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
            <ImagePreview :image="form.imagePreview" />
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
          <div class="mb-2 flex items-center justify-between">
            <label class="text-sm font-medium text-gray-300">
              短语内容 <span class="text-red-500">*</span>
            </label>
            <UButton @click="showPreview = !showPreview">{{
              showPreview ? '编辑' : '预览'
            }}</UButton>
          </div>
          <MarkdownDisplay
            v-if="showPreview"
            :content="form.content"
          ></MarkdownDisplay>
          <UTextarea
            v-else
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
    <div class="flex justify-end border-t border-[#2f3336] bg-[#121212] p-4">
      <UButton
        color="primary"
        class="flex items-center gap-2"
        @click="savePhrase"
      >
        <LoadingIcon v-if="loading"></LoadingIcon>
        保存
      </UButton>
    </div>
  </div>
</template>
