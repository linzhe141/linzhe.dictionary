<script setup lang="ts">
const endDate = new Date('2023-12-31')
const color = ref<any[]>([])
const isOpen = ref(false)
onMounted(() => {
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
</script>

<template>
  <div
    class="mx-auto max-w-[600px] border-b border-l border-r border-[#2f3336] pb-4"
  >
    <UModal v-model="isOpen">
      <div class="p-4">
        <div>
          <div>编辑 Profile</div>
        </div>
        <div>
          <div class="relative flex h-[200px] items-center justify-center">
            <img
              class="absolute"
              src="https://pbs.twimg.com/profile_banners/1632658050506194945/1689315235/600x200"
            />
            <div
              class="icon-bg mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full"
            >
              <UIcon name="i-heroicons-camera" />
            </div>
            <div
              class="icon-bg flex size-10 cursor-pointer items-center justify-center rounded-full"
            >
              <UIcon name="i-heroicons-x-mark" />
            </div>
          </div>
          <div
            class="flex -translate-y-[70px] items-center justify-between px-4"
          >
            <div class="relative flex size-[100px] items-center justify-center">
              <div>
                <img
                  class="absolute right-[5px] top-[5px] h-[90px] rounded-full"
                  alt="Opens profile photo"
                  src="https://pbs.twimg.com/profile_images/1679735939873267716/CY31ZbHn_reasonably_small.jpg"
                />
                <div
                  class="icon-bg mr-2 flex size-10 cursor-pointer items-center justify-center rounded-full"
                >
                  <UIcon name="i-heroicons-camera" />
                </div>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-full bg-black"
              ></div>
            </div>
          </div>
          <div class="-mt-[60px]">
            <UBadge color="white" variant="solid">用户名</UBadge>
            <UInput class="mt-4" color="primary" variant="outline" />
            <UBadge class="mt-4" color="white" variant="solid">Bio</UBadge>
            <UTextarea class="mt-4" color="primary" variant="outline" />
          </div>
        </div>
      </div>
    </UModal>
    <div class="flex h-10 items-center px-2">
      <UIcon
        name="i-heroicons-arrow-long-left"
        class="size-6 cursor-pointer"
        @click="() => router.go(-1)"
      ></UIcon>
      <div class="ml-10">
        <div>淋着</div>
        <div class="text-xs text-gray-400">7 words</div>
      </div>
    </div>
    <img
      class="h-[200px]"
      alt="profile photo background"
      src="https://pbs.twimg.com/profile_banners/1632658050506194945/1689315235/600x200"
    />

    <div class="flex -translate-y-[70px] items-center justify-between px-4">
      <div class="relative flex size-[140px] items-center justify-center">
        <div>
          <img
            class="rounded-full"
            alt="Opens profile photo"
            src="https://pbs.twimg.com/profile_images/1679735939873267716/CY31ZbHn_reasonably_small.jpg"
          />
        </div>
        <div
          class="absolute bottom-0 left-0 right-0 top-0 -z-10 rounded-full bg-black"
        ></div>
      </div>
      <UButton color="white" variant="solid" @click="clickHandle"
        >编辑 profile</UButton
      >
    </div>

    <div class="-mt-[60px] px-4">
      <div class="text-2xl">淋着</div>
      <div class="text-gray-400">@linzhe</div>
      <div class="mt-3">菜鸟前端</div>
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
