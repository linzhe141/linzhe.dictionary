<script setup lang="ts">
definePageMeta({
  layout: 'root-layout',
  middleware: 'auth',
})

const route = useRoute()
const {
  data: words,
  refresh: _refresh,
  status,
  error,
} = await useFetch('/api/vocabularyCheatSheet')
if (status.value === 'error' && error.value?.statusCode === 401) {
  // @ts-expect-error
  navigateTo({ path: 'login', query: { callback: route.name } })
}
const wordsList = ref(words.value?.map((i) => ({ ...i, showMeaning: true })))

function clickLight(item: any) {
  item.showMeaning = !item.showMeaning
}
</script>

<template>
  <div class="mx-auto max-w-[1200px] p-2">
    <UBreadcrumb
      class="text-lg"
      divider="/"
      :links="[{ label: '主页', to: '/home' }, { label: '生词本' }]"
    />
    <div class="grid grid-cols-1 gap-2 p-2 lg:grid-cols-2">
      <UCard
        v-for="(item, index) in wordsList"
        :key="item.word"
        :class="{
          'lg:col-span-2':
            wordsList!.length % 2 !== 0 && index === wordsList!.length - 1,
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div v-html="item.word"></div>
            <div
              :class="{ light: item.showMeaning }"
              class="bg-green-radial-gradient relative flex h-full cursor-pointer items-center justify-center hover:rounded-full"
              @click="() => clickLight(item)"
            >
              <div class="glowing"></div>
              <UIcon name="i-heroicons-light-bulb" class="mt-2 size-5" />
            </div>
          </div>
        </template>
        <div class="mb-2 flex justify-between">
          <div class="flex items-center">
            <span class="normal-text mr-2 rounded p-1">
              /{{ item.symbols || '暂无音标' }}/
            </span>
            <UIcon
              name="i-heroicons-speaker-wave"
              class="cursor-pointer hover:text-green-400"
              @click="() => playAudio(item.word)"
            />
          </div>
        </div>
        <template v-if="item.showMeaning">
          <!-- <div v-for="i of item.trans.split(';')" :key="i" class="mt-2">
            {{ i }}
          </div> -->
          <div class="mt-2">
            {{ item.trans }}
          </div>
        </template>
        <template v-else>
          <div>************</div>
        </template>
      </UCard>
    </div>
    <div v-if="wordsList?.length === 0">
      <UCard>
        <div class="text-red-300">当前没有收录的生词!</div>
      </UCard>
    </div>
  </div>
</template>
