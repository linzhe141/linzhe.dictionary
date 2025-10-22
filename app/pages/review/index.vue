<script setup lang="ts">
import type { Word } from '~~/types'

definePageMeta({
  middleware: 'auth',
})
const router = useRouter()
const dictionaryRef = inject('dictionaryRef') as Ref<Word[]>
const { data: words } = await useFetch('/api/vocabularyCheatSheet')
function getRandomElement<T extends Record<string, any>>(array: T[]) {
  if (array.length === 0) {
    return undefined
  }

  const randomIndex = Math.floor(Math.random() * array.length)

  const result = array[randomIndex] as T
  return { ...result, showDetail: false, showMeaning: false }
}

const curWord = ref(words.value ? getRandomElement(words.value) : undefined)
function changeWord() {
  const target = getRandomElement(words.value!)
  detail.value = null
  curWord.value = target
}

const detail = ref<null | any[]>(null)
function sortStringsByOf(data: Word[]) {
  const word = curWord.value!.word
  return data.sort((a, b) => {
    const indexA = a.word.indexOf(word)
    const indexB = b.word.indexOf(word)
    if (indexA === indexB) {
      return a.word.localeCompare(b.word)
    }
    return indexA - indexB
  })
}
function showDetail() {
  // @ts-ignore
  curWord.value!.showDetail = true
  const word = curWord.value!.word

  detail.value = sortStringsByOf(
    dictionaryRef.value.filter((i) => i.word.includes(word)),
  )
    .map((i) => ({
      ...i,
      colorWord: i.word.replace(
        new RegExp(word),
        `<span class="text-green-500">${word}</span>`,
      ),
    }))
    .slice(0, 10)
}
</script>

<template>
  <div
    class="mx-auto min-h-screen max-w-[842px] border-l border-r border-[#2f3336] pb-4"
  >
    <div class="flex h-10 items-center px-2">
      <UIcon
        name="i-heroicons-arrow-long-left"
        class="size-6 cursor-pointer"
        @click="() => router.go(-1)"
      ></UIcon>
    </div>
    <div v-if="!curWord" class="mx-2">
      <UCard>
        <div class="text-red-300">当前没有收录的生词!</div>
      </UCard>
    </div>
    <template v-if="curWord">
      <UCard class="mx-2" :class="{ 'normal-text': true }">
        <template #header>
          <div class="flex items-center justify-between">
            <div v-html="curWord.word"></div>
            <div
              :class="{ light: curWord.showMeaning }"
              class="bg-green-radial-gradient relative flex h-full cursor-pointer items-center justify-center hover:rounded-full"
            >
              <div class="glowing"></div>
              <UIcon
                name="i-heroicons-light-bulb"
                class="mt-2 size-5"
                @click="
                  () => {
                    curWord!.showMeaning = !curWord!.showMeaning
                  }
                "
              />
              <UIcon
                v-if="dictionaryRef.length"
                name="i-heroicons-globe-asia-australia"
                class="ml-3 mt-2 size-5 text-green-500"
                @click="showDetail"
              />
            </div>
          </div>
        </template>
        <div class="mb-2 flex justify-between">
          <div class="flex items-center">
            <span class="mr-2 rounded p-1">
              /{{ curWord.symbols || '暂无音标' }}/
            </span>
            <UIcon
              name="i-heroicons-speaker-wave"
              class="cursor-pointer hover:text-green-400"
              @click="() => playAudio(curWord!.word)"
            />
          </div>
        </div>
        <template v-if="curWord.showMeaning">
          <div class="mt-2">
            {{ curWord.trans }}
          </div>
        </template>
        <template v-else>
          <div>************</div>
        </template>
      </UCard>
      <div v-if="curWord.showDetail" class="my-4 space-y-4">
        <UBadge class="mx-2 my-4" color="neutral" variant="outline">
          Details
        </UBadge>
        <UCard v-for="item in detail" :key="item.word" class="mx-2">
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
    </template>
    <div class="mt-10 flex items-center justify-center">
      <UIcon
        name="i-heroicons-arrow-path-rounded-square-solid"
        class="mt-2 size-[100px] cursor-pointer transition-transform duration-300 ease-in-out hover:rotate-12 hover:scale-110"
        @click="changeWord"
      />
    </div>
  </div>
</template>
