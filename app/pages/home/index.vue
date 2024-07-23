<script setup lang="ts">
definePageMeta({
  layout: 'root-layout',
})
const router = useRouter()
const route = useRoute()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dictionary: any[] = []
const word = ref(route.query.word ?? 'zoo')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const submitList = ref<any[]>([])
const isNotFound = ref(false)
function submit() {
  if (word.value === '') return
  isNotFound.value = false
  router.replace({ query: { word: word.value } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitList.value = dictionary.filter((i: any) => i.word.includes(word.value))
  if (!submitList.value.length) {
    isNotFound.value = true
  }
}

async function playAudio(word: string) {
  const { data } = await useFetch('/api/dictvoice', {
    query: { word },
    responseType: 'blob',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blobUrl = URL.createObjectURL(data.value as any)
  const audio = new Audio(blobUrl)
  audio.play()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatCET(data: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((i: any) => ({
    word: i.headWord,
    symbols: i.content.word.content.ukphone,
    trans: i.content.word.content.trans.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => `${item.pos}. ${item.tranCn}`,
    ), // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examples: i.content.word.content.sentence?.sectences?.map((item: any) => ({
      sentence: item.sentences,
      trans: item.sCn,
    })),
  }))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatWords(data: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((i: any) => ({
    word: i.word,
    symbols: i.symbols,
    trans: [`${i.part} ${i.mean}`],
    examples: [{ sentence: i.ex, trans: i.tran }],
  }))
}
const initLoading = ref(true)
async function init() {
  initLoading.value = true
  const data1 = await $fetch('/words/cet6-1.json')
  const data2 = await $fetch('/words/cet6-2.json')
  const data3 = await $fetch('/words/cet6-3.json')
  const data4 = await $fetch('/words/words.json')
  dictionary = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...formatWords(data4 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...formatCET(data1 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...formatCET(data2 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...formatCET(data3 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ].map((i: any) => ({ ...i, showMeaning: true }))
  if (word.value) {
    submit()
  }
  initLoading.value = false
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function clickLight(item: any) {
  item.showMeaning = !item.showMeaning
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <!-- TODO -->
    <!-- <div class="p-2">
      <UCard>
        <ULink
          to="/vocabulary-book"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          生词本
        </ULink>
      </UCard>
    </div> -->
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
        <UButton class="mt-2 text-white" block @click="submit">翻译</UButton>
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
            <div>{{ item.word }}</div>
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
          <div v-for="i of item.examples" :key="i">
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
