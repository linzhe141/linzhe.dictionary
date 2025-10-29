<script setup lang="ts">
import ImgCropper from '~/components/img-cropper.vue'
import ActivityOverview from '~/components/activity-overview.vue'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const startYear = new Date().getFullYear()
const isOpen = ref(false)
const isImgCropperOpen = ref(false)

const profileInfo = reactive({
  createTime: '',
  vocabularySum: 0,
  username: '',
  nickname: '',
  bio: '',
  bgImage: '',
  avatarImage: '',
})

let currentkey: 'bgImage' | 'avatarImage' | '' = ''

const editData = reactive({}) as typeof profileInfo
const editImgData = reactive({}) as typeof profileInfo

const bgInputFile = ref<HTMLInputElement | null>(null)
const avatarInputFile = ref<HTMLInputElement | null>(null)

const imgCropperOptions = reactive({
  height: 160,
  width: 480,
})

const submitBtnDisabled = ref(false)

const imgCropper = ref<InstanceType<typeof ImgCropper> | null>(null)

async function processImg() {
  const data = await $fetch('/api/profiles/info')
  Object.assign(profileInfo, data)
  Object.assign(editData, profileInfo)
}

function clickHandle() {
  isOpen.value = true
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

async function inputFileChangeHandle(e: Event, key: 'bgImage' | 'avatarImage') {
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

function clickActiveDate(data: { date: string; count: number }) {
  console.log(data)
}
const { data: words } = await useFetch('/api/vocabularyCheatSheet')
const activeDates = computed(formatGroupDate)
function formatGroupDate() {
  const groupMap = new Map<string, number>()
  if (!words.value) return []
  words.value.forEach((item) => {
    const date = item.createdAt.split('T')[0]!
    groupMap.set(date, (groupMap.get(date) || 0) + 1)
  })
  return Array.from(groupMap.entries()).map(([date, count]) => ({
    date,
    count,
  }))
}
onMounted(() => {
  processImg()
})
</script>

<template>
  <div
    class="mx-auto max-w-[842px] overflow-x-hidden border-r border-b border-l border-[#2f3336] pb-4"
  >
    <div class="flex h-10 items-center px-2">
      <RouterBack></RouterBack>
      <div class="ml-10">
        <div>{{ profileInfo.nickname ?? '--' }}</div>
        <div class="text-xs text-gray-400">
          {{ profileInfo.vocabularySum }} words
        </div>
      </div>
    </div>
    <div class="flex h-[280px] w-[840px] items-center justify-center">
      <img
        v-if="profileInfo.bgImage"
        class="h-full w-[calc(100%-2px)]"
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
          class="absolute top-0 right-0 bottom-0 left-0 -z-10 rounded-full bg-black"
        ></div>
      </div>
      <UButton color="neutral" variant="outline" @click="clickHandle">
        编辑 profile
      </UButton>
      <UModal v-model:open="isOpen" prevent-close>
        <template #content>
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
                color="neutral"
                variant="outline"
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
                  class="absolute h-40 w-full"
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
                    @change="(e: any) => inputFileChangeHandle(e, 'bgImage')"
                  />
                </label>
              </div>
              <div
                class="flex -translate-y-[70px] items-center justify-between px-4"
              >
                <div
                  class="relative flex size-[100px] items-center justify-center"
                >
                  <div>
                    <img
                      v-if="editData.avatarImage"
                      class="absolute top-[5px] left-[5px] h-[90px] w-[90px] rounded-full"
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
                        @change="
                          (e: any) => inputFileChangeHandle(e, 'avatarImage')
                        "
                      />
                    </label>
                  </div>
                  <div
                    class="absolute top-0 right-0 bottom-0 left-0 -z-10 rounded-full bg-black"
                  ></div>
                </div>
              </div>
              <div class="-mt-[60px] flex flex-col">
                <div>
                  <UBadge color="neutral" variant="outline">昵称</UBadge>
                </div>
                <UInput
                  v-model="editData.nickname"
                  class="mt-4"
                  color="primary"
                  variant="outline"
                />
                <div>
                  <UBadge class="mt-4" color="neutral" variant="outline">
                    Bio
                  </UBadge>
                </div>
                <UTextarea
                  v-model="editData.bio"
                  class="mt-4"
                  color="primary"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </template>
      </UModal>
      <UModal v-model:open="isImgCropperOpen" prevent-close>
        <template #content>
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
              <UButton color="neutral" variant="outline" @click="applyHandle">
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
        </template>
      </UModal>
    </div>

    <div class="-mt-[60px] px-4">
      <div class="text-2xl">{{ profileInfo.nickname ?? '--' }}</div>
      <div class="text-gray-400">
        {{ profileInfo.username ? `@${profileInfo.username}` : '--' }}
      </div>
      <div class="mt-3">{{ profileInfo.bio ?? '--' }}</div>
      <div class="mt-3 flex items-center text-gray-400">
        <UIcon name="i-heroicons-calendar-days" class="mr-2"></UIcon>
        <span class="text-xs">Joined {{ profileInfo.createTime }}</span>
      </div>

      <div class="normal-text mt-10 overflow-auto">
        <ActivityOverview
          :active-dates
          :start-year
          @click-active-date="clickActiveDate"
        ></ActivityOverview>
      </div>
    </div>

    <LogoLink
      class="fixed top-[100px] -translate-x-[300px] rotate-90"
    ></LogoLink>
  </div>
</template>
