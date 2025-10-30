<script setup lang="ts">
import WordsListProvider from './provider/WordsListProvider'
import MergeUserinfoIfLogin from './provider/MergeUserinfoIfLogin'

useHead({
  htmlAttrs: {
    class: 'dark',
  },
  title: 'dictionary',
  meta: [
    { name: 'description', content: 'linzhe的英语单词小抄' },
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    },
  ],
})

const showIcon = ref(false)

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function scrollHandle() {
  const scrollY = window.scrollY
  showIcon.value = scrollY > 200
}

onMounted(() => {
  window.addEventListener('scroll', scrollHandle)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandle)
})
</script>

<template>
  <UApp>
    <MergeUserinfoIfLogin />
    <WordsListProvider>
      <NuxtLayout>
        <!-- router-view 入口？ -->
        <NuxtPage />
      </NuxtLayout>
    </WordsListProvider>
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-4 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-90"
    >
      <button
        v-if="showIcon"
        aria-label="返回顶部"
        class="group from-primary-400 to-primary-600 shadow-primary/30 hover:shadow-primary/50 fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:shadow-xl active:scale-95 sm:right-6 sm:bottom-6"
        @click="toTop"
      >
        <UIcon
          name="i-heroicons-arrow-up"
          class="h-6 w-6 text-white transition-transform group-hover:-translate-y-0.5"
        />
      </button>
    </Transition>
  </UApp>
</template>
