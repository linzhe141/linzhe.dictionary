<script setup lang="ts">
const router = useRouter()
const route = useRoute()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dictionary: any[] = []
const word = ref(route.query.word ?? '')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const submitList = ref<any[]>([])
function submit() {
  router.replace({ query: { word: word.value } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitList.value = dictionary.filter((i: any) =>
    i.headWord.includes(word.value),
  )
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
async function init() {
  const data1 = await $fetch('/cet6/1.json')
  const data2 = await $fetch('/cet6/2.json')
  const data3 = await $fetch('/cet6/3.json')
  dictionary = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(data1 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(data2 as any[]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(data3 as any[]),
  ]
  if (word.value) {
    submit()
  }
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
          to="/vocabulary-book"
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
        <UButton class="mt-2 text-white" block @click="submit">翻译</UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
      <UCard v-for="item of submitList" :key="item.headWord">
        <template #header>{{ item.headWord }}</template>
        <div class="mb-2">
          <span
            class="phonetic-symbols cursor-pointer rounded p-1 hover:bg-green-400"
            @click="() => playAudio(item.headWord)"
            >/{{ item.content.word.content.ukphone }}/</span
          >
        </div>
        <div
          v-for="i of item.content.word.content.trans"
          :key="`${i.pos}.${i.tranCn}`"
        >
          {{ `${i.pos}. ${i.tranCn}` }}
        </div>
      </UCard>
    </div>
  </div>
</template>
