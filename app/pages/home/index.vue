<script setup lang="ts">
import type { CET6_WORD, GithubWord, Word } from '~~/types'

definePageMeta({
  layout: 'root-layout',
})
const router = useRouter()
const route = useRoute()

function generateWord() {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const randomIndex1 = Math.floor(Math.random() * letters.length)
  const randomIndex2 = Math.floor(Math.random() * letters.length)
  const randomLetter1 = letters[randomIndex1]!
  const randomLetter2 = letters[randomIndex2]!
  const part = randomLetter1 + randomLetter2
  return part
}

let dictionary: Word[] = []
const word = ref<string>(route.query.word as string)
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
  if (word.value.length <= 1) {
    return toast.add({ title: '至少输入两个字符', color: 'red' })
  }
  isNotFound.value = false
  router.replace({ query: { word: word.value } })
  submitList.value = sortStringsByOf(
    dictionary.filter((i) => i.word.includes(word.value)),
  ).map((i) => ({
    ...i,
    colorWord: i.word.replace(
      new RegExp(word.value),
      `<span class="text-green-500">${word.value}</span>`,
    ),
  }))

  if (!submitList.value.length) {
    isNotFound.value = true
  }
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
  generateExistWord()
  if (word.value) {
    submit()
  }
  initLoading.value = false
}
const toast = useToast()
async function addWordToCheatSheet(word: Word) {
  const { data, error, status } = await useFetch('/api/vocabularyCheatSheet', {
    method: 'post',
    body: { ...word, trans: word.trans.join(';') },
  })
  if (status.value === 'error' && error.value?.statusCode === 401) {
    // @ts-expect-error
    return navigateTo({ path: 'login', query: { callback: route.name } })
  }
  toast.add({
    title: data.value?.msg,
    color: data.value?.success ? 'primary' : 'red',
  })
}

function generateExistWord() {
  if (!route.query.word) {
    word.value = generateWord()
    const target = dictionary.find((i) => i.word.includes(word.value))
    if (!target) {
      generateExistWord()
    }
  }
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="mx-auto max-w-[1200px]">
    <div class="p-2">
      <UCard>
        <ULink
          to="/vocabulary-cheat-sheet"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          生词本
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
            <div v-html="item.colorWord"></div>
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
          <UButton
            icon="i-heroicons-plus-circle"
            size="sm"
            color="gray"
            variant="solid"
            @click="() => addWordToCheatSheet(item)"
          >
            添加至生词本
          </UButton>
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
