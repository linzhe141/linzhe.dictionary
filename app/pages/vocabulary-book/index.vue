<script setup lang="ts">
const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const { data } = await useFetch(url + 'card')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const result = (data.value as any)[0] as any
const list = new Array(10).fill(1).map(() => {
  return {
    word: result.word,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phonetic: result.phonetics.filter((i: any) => i.audio && i.text)[0],
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  }
})
function playAudio(audioUrl: string) {
  const audio = new Audio(audioUrl)
  audio.play()
}
</script>

<template>
  <div class="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
    <UCard v-for="(item, index) in list" :key="item.word + index">
      <template #header>{{ item.word }}</template>
      <div class="mb-2">
        <span
          class="phonetic-symbols cursor-pointer rounded p-1 hover:bg-green-400"
          @click="() => playAudio(item.phonetic.audio)"
          >{{ item.phonetic.text }}</span
        >
      </div>
      <div v-for="i of item.meanings" :key="i">{{ i }}</div>
    </UCard>
  </div>
</template>
