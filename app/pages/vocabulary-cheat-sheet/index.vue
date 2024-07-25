<script setup lang="ts">
definePageMeta({
  layout: 'root-layout',
})

const { data: words, refresh: _refresh } = await useFetch(
  '/api/vocabularyCheatSheet',
)
const wordsList = ref(words.value?.map((i) => ({ ...i, showMeaning: true })))

function clickLight(item: any) {
  item.showMeaning = !item.showMeaning
}
</script>

<template>
  <div class="p-2">
    <UBreadcrumb
      class="text-lg"
      divider="/"
      :links="[{ label: '翻译', to: '/home' }, { label: '生词本' }]"
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
            <span class="phonetic-symbols mr-2 rounded p-1">
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
  </div>
</template>
