<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import ImgCropper from '~/components/ImgCropper.vue'

const endDate = new Date('2023-12-31')
const color = ref<any[]>([])
const isOpen = ref(false)
const isImgCropperOpen = ref(false)

const profileInfo = reactive({
  name: '',
  nickname: '',
  bio: '',
  bgImage: '',
  avatarImage: '',
})
async function processImg() {
  const data = await $fetch('/api/users')
  profileInfo.name = data?.name || ''
  if (data?.profiles) {
    profileInfo.nickname = data.profiles.nickname ?? ''
    profileInfo.bio = data.profiles.bio ?? ''
    profileInfo.avatarImage = data.profiles.avatarImage ?? ''
    profileInfo.bgImage = data.profiles.bgImage ?? ''
  }
  Object.assign(editData, profileInfo)
}
onMounted(() => {
  processImg()
  const rangColor = ['#9be9a8', '#40c463', '#30a14e', '#216e39']
  const html = document.getElementsByTagName('html')!
  color.value = html[0]?.classList.contains('dark')
    ? ['#161b22', ...rangColor]
    : ['#ebedf0', ...rangColor]
})
const router = useRouter()

function clickHandle() {
  isOpen.value = true
}

const editData = reactive({}) as typeof profileInfo
const editImgData = reactive({}) as typeof profileInfo

type EditData = typeof editData
const bgInputFile = ref<HTMLInputElement | null>(null)
const avatarInputFile = ref<HTMLInputElement | null>(null)

async function dataUrlToFile(dataUrl: string): Promise<File> {
  const res: Response = await fetch(dataUrl)
  const blob: Blob = await res.blob()
  return new File([blob], uuidv4(), { type: 'image/png' })
}

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await $fetch('/api/files', {
    method: 'POST',
    body: formData,
  })
  return data
}

async function submitHandle() {
  submitBtnDisabled.value = true
  await $fetch('/api/profiles', {
    method: 'PATCH',
    body: editData,
  })
  processImg()
  isOpen.value = false
  setTimeout(() => {
    submitBtnDisabled.value = false
  }, 500)
}
let currentkey: keyof EditData | '' = ''
async function inputFileChangeHandle(e: Event, key: keyof EditData) {
  currentkey = key
  const data = (e.target as HTMLInputElement).files![0]!
  const tempData = URL.createObjectURL(data)
  editImgData[key] = tempData
  isImgCropperOpen.value = true
  if (key === 'bgImage') {
    imgCropperOptions.height = 160
    imgCropperOptions.width = 480
  } else if (key === 'avatarImage') {
    imgCropperOptions.height = 480
    imgCropperOptions.width = 480
  }
}
const submitBtnDisabled = ref(false)

const imgCropper = ref<InstanceType<typeof ImgCropper> | null>(null)
async function applyHandle() {
  const base64Data = imgCropper.value!.getCroppedImg()
  if (currentkey) {
    editData[currentkey] = base64Data
    const file = await dataUrlToFile(base64Data)
    const imagePathname = (await uploadImage(file)).pathname
    const image = `/images/${imagePathname}`
    editData[currentkey] = image
  }
  isImgCropperOpen.value = false
}
const imgCropperOptions = reactive({
  height: 160,
  width: 480,
})
</script>

<template>
  <div
    class="mx-auto max-w-[600px] border-b border-l border-r border-[#2f3336] pb-4"
  >
    <UModal v-model="isOpen" prevent-close>
      <div class="p-4">
        <div class="mb-3 flex justify-between">
          <div class="flex items-center">
            <div
              class="icon-bg flex size-8 cursor-pointer items-center justify-center rounded-full"
              @click="isOpen = false"
            >
              <UIcon name="i-heroicons-x-mark" />
            </div>
            <span class="ml-5">编辑 Profile</span>
          </div>
          <UButton
            color="white"
            variant="solid"
            :disabled="submitBtnDisabled"
            @click="submitHandle"
          >
            保存
          </UButton>
        </div>
        <div>
          <div
            class="relative flex h-[200px] items-center justify-center"
            :class="{ 'border border-[#2f3336]': !editData.bgImage }"
          >
            <img
              v-if="editData.bgImage"
              class="absolute h-[160px] w-full"
              :src="editData.bgImage"
            />
            <label
              class="icon-bg flex size-10 cursor-pointer items-center justify-center rounded-full"
            >
              <UIcon name="i-heroicons-camera" />
              <input
                ref="bgInputFile"
                type="file"
                class="hidden"
                @change="(e) => inputFileChangeHandle(e, 'bgImage')"
              />
            </label>
          </div>
          <div
            class="flex -translate-y-[70px] items-center justify-between px-4"
          >
            <div class="relative flex size-[100px] items-center justify-center">
              <div>
                <img
                  v-if="editData.avatarImage"
                  class="absolute left-[5px] top-[5px] h-[90px] w-[90px] rounded-full"
                  :src="editData.avatarImage"
                />
                <label
                  class="icon-bg flex size-10 cursor-pointer items-center justify-center rounded-full"
                >
                  <UIcon name="i-heroicons-camera" />
                  <input
                    ref="avatarInputFile"
                    type="file"
                    class="hidden"
                    @change="(e) => inputFileChangeHandle(e, 'avatarImage')"
                  />
                </label>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-full bg-black"
              ></div>
            </div>
          </div>
          <div class="-mt-[60px]">
            <UBadge color="white" variant="solid">昵称</UBadge>
            <UInput
              v-model="editData.nickname"
              class="mt-4"
              color="primary"
              variant="outline"
            />
            <UBadge class="mt-4" color="white" variant="solid">Bio</UBadge>
            <UTextarea
              v-model="editData.bio"
              class="mt-4"
              color="primary"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </UModal>
    <UModal v-model="isImgCropperOpen" prevent-close>
      <div class="p-4">
        <div class="mb-3 flex justify-between">
          <div class="flex items-center">
            <div
              class="icon-bg flex size-8 cursor-pointer items-center justify-center rounded-full"
              @click="isImgCropperOpen = false"
            >
              <UIcon name="i-heroicons-x-mark" />
            </div>
            <span class="ml-5">编辑图片</span>
          </div>
          <UButton color="white" variant="solid" @click="applyHandle">
            应用
          </UButton>
        </div>
        <ImgCropper
          v-if="currentkey"
          ref="imgCropper"
          v-bind="imgCropperOptions"
          :url="editImgData[currentkey]"
        ></ImgCropper>
      </div>
    </UModal>
    <div class="flex h-10 items-center px-2">
      <UIcon
        name="i-heroicons-arrow-long-left"
        class="size-6 cursor-pointer"
        @click="() => router.go(-1)"
      ></UIcon>
      <div class="ml-10">
        <div>{{ profileInfo.nickname ?? '--' }}</div>
        <div class="text-xs text-gray-400">7 words</div>
      </div>
    </div>
    <div class="flex h-[200px] w-[600px] items-center justify-center">
      <img
        v-if="profileInfo.bgImage"
        class="h-[200px] w-full"
        :src="profileInfo.bgImage"
      />
    </div>

    <div class="flex -translate-y-[70px] items-center justify-between px-4">
      <div class="relative flex size-[140px] items-center justify-center">
        <div class="size-[130px]">
          <img
            v-if="profileInfo.avatarImage"
            class="size-[130px] rounded-full"
            :src="profileInfo.avatarImage"
          />
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-full bg-black"
        ></div>
      </div>
      <UButton color="white" variant="solid" @click="clickHandle">
        编辑 profile
      </UButton>
    </div>

    <div class="-mt-[60px] px-4">
      <div class="text-2xl">{{ profileInfo.nickname ?? '--' }}</div>
      <div class="text-gray-400">
        {{ profileInfo.name ? `@${profileInfo.name}` : '--' }}
      </div>
      <div class="mt-3">{{ profileInfo.bio ?? '--' }}</div>
      <div class="mt-3 flex items-center text-gray-400">
        <UIcon name="i-heroicons-calendar-days" class="mr-2"></UIcon>
        <span class="text-xs">Joined March 2023</span>
      </div>

      <div class="normal-text mt-10">
        <CalendarHeatmap
          :dark-mode="true"
          :values="[
            { date: '2023-6-22', count: 6 },
            { date: '2023-6-23', count: 6 },
            { date: '2023-6-24', count: 6 },
            { date: '2023-6-25', count: 6 },
            { date: '2023-6-26', count: 1 },
            { date: '2023-6-27', count: 16 },
          ]"
          :range-color="color"
          :end-date="endDate"
          :round="2"
        />
      </div>
    </div>
  </div>
</template>
