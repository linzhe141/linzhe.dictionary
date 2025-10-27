<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const toast = useToast()

interface PhraseForm {
  image: File | null
  imagePreview: string
  content: string
  source: string
}

const form = reactive<PhraseForm>({
  image: null,
  imagePreview: '',
  content: '',
  source: '',
})

const showPreview = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.add({
        title: '错误',
        description: '请选择图片文件',
      })
      return
    }

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

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 保存短语
const savePhrase = async () => {
  if (!form.content.trim()) {
    toast.add({
      title: '提示',
      description: '请输入短语内容',
    })
    return
  }

  try {
    // 这里添加你的保存逻辑，例如调用API
    // const formData = new FormData()
    // if (form.image) formData.append('image', form.image)
    // formData.append('content', form.content)
    // formData.append('source', form.source)
    // await $fetch('/api/phrases', { method: 'POST', body: formData })

    toast.add({
      title: '成功',
      description: '短语创建成功',
    })

    router.push('/phrases')
  } catch (error) {
    toast.add({
      title: '错误',
      description: '保存失败，请重试',
    })
  }
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
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
        <h1 class="text-lg font-semibold">创建短语</h1>
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
      <div class="rounded-lg border border-[#2f3336] bg-[#16181c] p-6">
        <!-- 图片预览 -->
        <div v-if="form.imagePreview" class="mb-6">
          <img
            :src="form.imagePreview"
            alt="短语配图"
            class="w-full rounded-lg object-cover"
            style="max-height: 300px"
          />
          <p v-if="form.source" class="mt-2 text-sm text-gray-400">
            出处: {{ form.source }}
          </p>
        </div>

        <!-- 短语内容 -->
        <div class="font-mono text-base leading-relaxed whitespace-pre-wrap">
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
            <p class="text-sm text-gray-400">点击上传图片</p>
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

        <!-- 图片出处 -->
        <div v-if="form.imagePreview">
          <label class="mb-2 block text-sm font-medium text-gray-300">
            图片出处
          </label>
          <UInput
            v-model="form.source"
            placeholder="例如：电影《肖申克的救赎》"
            size="lg"
          />
        </div>

        <!-- 短语内容 -->
        <div class="">
          <label class="mb-2 block text-sm font-medium text-gray-300">
            短语内容 <span class="text-red-500">*</span>
          </label>
          <UTextarea
            class="monospace-textarea normal-text w-full"
            v-model="form.content"
            placeholder="I hereby announce my retirement form formula one by the end of the 2022 season
^ 特地，在此"
            :rows="8"
            size="lg"
            autoresize
          />
          <p class="mt-2 text-xs text-gray-500">
            使用等宽字体，你可以按照自己的方式自由排版和标注
          </p>
        </div>

        <!-- 提示信息 -->
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
