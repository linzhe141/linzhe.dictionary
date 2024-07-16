<script setup lang="ts">
import part1 from '~/assets/cet6/cet6-1'
import part2 from '~/assets/cet6/cet6-2'
import part3 from '~/assets/cet6/cet6-3'

const dictionary = [...part1, ...part2, ...part3]
const word = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const submitList = ref<any[]>([])
function submit() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitList.value = dictionary.filter((i: any) =>
    i.headWord.includes(word.value),
  )
}

async function playAudio(word: string) {
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
  const { data } = await useFetch(url + word)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = (data.value as any)[0] as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const phonetic = result.phonetics.filter((i: any) => i.audio && i.text)[0]
  const audio = new Audio(phonetic.audio)
  audio.play()
}
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
          class="ml-2 flex-1"
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
            >/{{ item.content.word.content.usphone }}/</span
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
