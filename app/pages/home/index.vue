<script setup lang="ts">
import type { CET6_WORD, GithubWord, Word } from '~~/types'

definePageMeta({
  layout: 'root-layout',
})
const router = useRouter()
const route = useRoute()
let dictionary: Word[] = []
const word = ref<string>((route.query.word as string) ?? 'zoo')
const submitList = ref<Word[]>([])
const isNotFound = ref(false)
function sortStringsByOf(data: Word[]) {
  return data.sort((a, b) => {
    const indexA = a.word.indexOf(word.value)
    const indexB = b.word.indexOf(word.value)
    if (indexA === indexB) {
      return a.word.localeCompare(b.word)
    }
    return indexA - indexB
  })
}
function submit() {
  if (word.value === '') return
  isNotFound.value = false
  router.replace({ query: { word: word.value } })
  submitList.value = sortStringsByOf(
    dictionary.filter((i) => i.word.includes(word.value)),
  ).map((i) => ({
    ...i,
    word: i.word.replace(
      new RegExp(word.value),
      `<span class="text-green-500">${word.value}</span>`,
    ),
  }))

  if (!submitList.value.length) {
    isNotFound.value = true
  }
}

async function playAudio(word: string) {
  const { data } = await useFetch('/api/dictvoice', {
    query: { word },
    responseType: 'blob',
  })
  const blobUrl = URL.createObjectURL(data.value as Blob)
  const audio = new Audio(blobUrl)
  audio.play()
}
function formatCET(data: CET6_WORD[]): Word[] {
  return data.map((i) => ({
    word: i.headWord,
    symbols: i.content.word.content.ukphone,
    trans: i.content.word.content.trans.map(
      (item) => `${item.pos}. ${item.tranCn}`,
    ),
    examples: i.content.word.content.sentence?.sentences?.map((item) => ({
      sentence: item.sContent,
      trans: item.sCn,
    })),
  }))
}
function formatWords(data: GithubWord[]) {
  return data.map((i) => ({
    word: i.word,
    symbols: i.symbols,
    trans: [`${i.part} ${i.mean}`],
    examples: [{ sentence: i.ex, trans: i.tran }],
  }))
}
const initLoading = ref(true)
async function init() {
  initLoading.value = true
  const data1: CET6_WORD[] = await $fetch('/words/cet6-1.json')
  const data2: CET6_WORD[] = await $fetch('/words/cet6-2.json')
  const data3: CET6_WORD[] = await $fetch('/words/cet6-3.json')
  const data4: GithubWord[] = await $fetch('/words/words.json')
  dictionary = [
    ...formatWords(data4),
    ...formatCET(data1),
    ...formatCET(data2),
    ...formatCET(data3),
  ].map((i) => ({ ...i, showMeaning: true }))
  if (word.value) {
    submit()
  }
  initLoading.value = false
}
function clickLight(item: Word) {
  item.showMeaning = !item.showMeaning
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div class="p-2">
      <UCard>
        <ULink
          to="/todos"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          TODO
        </ULink>
      </UCard>
    </div>
    <div class="p-2">
      <div class="flex items-center">
        <UInput
          v-model="word"
          class="flex-1"
          color="primary"
          variant="outline"
          placeholder="请输入..."
          @keyup.enter="submit"
        />
      </div>
      <div>
        <UButton
          class="mt-2 text-white"
          block
          :disabled="initLoading"
          @click="submit"
          >翻译</UButton
        >
      </div>
    </div>
    <div v-if="!initLoading" class="grid grid-cols-1 gap-2 p-2 lg:grid-cols-2">
      <UCard
        v-for="(item, index) in submitList"
        :key="item.word"
        :class="{
          'lg:col-span-2':
            submitList.length % 2 !== 0 && index === submitList.length - 1,
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
        <div class="mb-2">
          <span
            class="phonetic-symbols cursor-pointer rounded p-1 hover:bg-green-400"
            @click="() => playAudio(item.word)"
            >/{{ item.symbols }}/</span
          >
        </div>
        <template v-if="item.showMeaning">
          <div v-for="i of item.trans" :key="i" class="mt-2">
            {{ i }}
          </div>
          <div v-for="i of item.examples" :key="i.sentence">
            <div class="mt-2">
              <span class="mr-2">例句：</span>{{ i.sentence }}
            </div>
            <div class="mt-2">
              <span class="mr-2">翻译：</span>{{ i.trans }}
            </div>
          </div>
        </template>
        <template v-else>
          <div>************</div>
        </template>
      </UCard>
    </div>
    <div v-else class="grid grid-cols-1 gap-2 p-2 lg:grid-cols-2">
      <UCard v-for="(item, index) in 4" :key="index">
        <template #header>
          <div class="flex items-center justify-between">
            <USkeleton class="h-4 w-[250px]" />
          </div>
        </template>
        <div class="mb-2">
          <USkeleton class="h-4 w-[200px]" />
        </div>
        <div class="mt-2">
          <USkeleton class="h-4 w-[350px]" />
        </div>
        <div class="mt-2"><USkeleton class="h-4 w-[360px]" /></div>
        <div class="mt-2"><USkeleton class="h-4 w-[360px]" /></div>
      </UCard>
    </div>
    <div class="p-2">
      <UCard v-if="isNotFound">
        <div class="text-red-300">数据库中暂无相关词汇!</div>
      </UCard>
    </div>
  </div>
</template>
