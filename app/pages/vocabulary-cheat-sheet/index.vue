<script setup lang="ts">
definePageMeta({
  layout: 'root-layout',
  middleware: 'auth',
})
const toast = useToast()
const { data: words, refresh: _refresh } = await useFetch(
  '/api/vocabularyCheatSheet',
)

const wordsList = ref(words.value?.map((i) => ({ ...i, showMeaning: true })))
watch(
  words,
  () =>
    (wordsList.value = words.value?.map((i) => ({ ...i, showMeaning: true }))),
)
function clickLight(item: any) {
  item.showMeaning = !item.showMeaning
}

async function deleteWord(item: any) {
  await $fetch('/api/vocabularyCheatSheet/' + item.id, { method: 'delete' })
  _refresh()
}

function downloadJSON() {
  const jsonData = JSON.stringify(wordsList.value!)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'vocabulary.json'
  link.click()
  URL.revokeObjectURL(link.href)
}

async function getJsonFromFile(file: File) {
  const reader = new FileReader()
  return await new Promise((resolve, reject) => {
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target!.result! as string)
        resolve(jsonData)
      } catch (err) {
        reject('文件内容不是有效的 JSON:')
      }
    }
    reader.readAsText(file)
  })
}
async function uploadJSON(inputEl: HTMLInputElement) {
  try {
    const data = await getJsonFromFile(inputEl.files![0]!)
    const res = await $fetch('/api/vocabularyCheatSheet/batch', {
      method: 'post',
      body: JSON.stringify(data),
    })
    if (res.data.error.length) {
      toast.add({
        title: res.data.error.map((i) => i.word).join(',') + ' 导入失败',
        color: 'red',
      })
    }
  } catch (e) {
    console.log(e)
  }
  _refresh()
  inputEl.value = ''
}
</script>

<template>
  <div class="mx-auto max-w-[1200px] p-2">
    <div class="flex justify-between">
      <UBreadcrumb
        class="text-lg"
        divider="/"
        :links="[{ label: '主页', to: '/home' }, { label: '生词本' }]"
      />
      <div>
        <UButton v-if="wordsList?.length" class="mr-3" @click="downloadJSON">
          下载JSON文件
        </UButton>
        <UButton>
          <label>
            上传JSON文件
            <input
              type="file"
              class="hidden"
              accept=".json"
              @change="(e) => uploadJSON(e.target as HTMLInputElement)"
            />
          </label>
        </UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-2 p-2 lg:grid-cols-2">
      <UCard
        v-for="(item, index) in wordsList"
        :key="item.word"
        :class="{
          'normal-text': true,
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
            >
              <div class="glowing"></div>
              <UIcon
                name="i-heroicons-light-bulb"
                class="mt-2 size-5"
                @click="() => clickLight(item)"
              />
              <UIcon
                name="i-heroicons-trash"
                class="ml-3 mt-2 size-5 text-red-500"
                @click="() => deleteWord(item)"
              />
              <UIcon
                name="i-heroicons-globe-asia-australia"
                class="ml-3 mt-2 size-5 text-green-500"
                @click="() => navigateTo('/home?word=' + item.word)"
              />
            </div>
          </div>
        </template>
        <div class="mb-2 flex justify-between">
          <div class="flex items-center">
            <span class="mr-2 rounded p-1">
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
