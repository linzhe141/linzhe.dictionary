<script setup lang="ts">
import './animation.css'
import { formatContet } from './mock-f1-news'

function getRandomElement() {
  const notes = formatContet()
  const randomStartIndex = Math.floor(Math.random() * notes.length)
  console.log('randomStartIndex', randomStartIndex)
  const size = 3
  const result = notes
    .slice(randomStartIndex, randomStartIndex + size)
    .join('\n\n---\n\n')
  return result
}
const source = ref('')
const isRacing = ref(false)

function handleClick() {
  if (isRacing.value) return
  isRacing.value = true
}
function handleRaceEnd() {
  if (isRacing.value === true) {
    currentTaskId++
    source.value = ''
    processStreamMarkdown()
    isRacing.value = false
  }
}

function createStream(text: string, chunkSize = 10, delay = 50) {
  let position = 0
  return new ReadableStream({
    pull(controller) {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (position >= text.length) {
            controller.close()
            resolve()
            return
          }

          const chunk = text.slice(position, position + chunkSize)
          position += chunkSize
          controller.enqueue(chunk)

          resolve()
        }, delay)
      })
    },
  })
}
let currentTaskId = 0
async function processStreamMarkdown() {
  const taskId = ++currentTaskId // 分配任务编号
  const randomContent = getRandomElement()
  const stream = createStream(randomContent)
  // ios 不支持 Symbol.asyncIterator
  const reader = stream.getReader()

  while (true) {
    if (taskId !== currentTaskId) break
    const { done, value: chunk } = await reader.read()
    if (done) break
    if (taskId !== currentTaskId) break
    source.value += chunk
  }
}
onMounted(() => {
  processStreamMarkdown()
})
</script>

<template>
  <div>
    <div class="text-center">
      <img
        src="./formula.png"
        class="w-[200px]"
        :class="isRacing ? 'race-animation' : ''"
        @animationend="handleRaceEnd"
      />
      <UIcon
        name="i-heroicons-arrow-path-rounded-square-solid"
        class="mt-2 size-10 cursor-pointer"
        :class="{ 'loading-animation': isRacing }"
        @click="handleClick"
      />
    </div>
    <MarkdownDisplay
      v-if="source"
      :content="source"
      class="vue-markdown-wrapper"
    ></MarkdownDisplay>
  </div>
</template>
