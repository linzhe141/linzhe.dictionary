<script setup lang="ts">
const showIcon = ref(false)
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
function scrollHandle() {
  showIcon.value = window.scrollY > 200
}

onMounted(() => {
  window.addEventListener('scroll', scrollHandle)
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandle)
})
</script>

<template>
  <div>
    <div
      class="fixed top-0 right-0 left-0 z-10 flex h-10 items-center bg-green-500 leading-10"
    >
      <h1 class="w-full text-center text-2xl">
        <ULink to="/" class="text-white"> dictionary!!! </ULink>
      </h1>
    </div>
    <div class="mt-10"><slot /></div>
    <div class="fixed right-2 bottom-2" @click="toTop">
      <UIcon
        v-if="showIcon"
        name="i-heroicons-arrow-up-circle-16-solid"
        class="size-6 cursor-pointer text-green-400"
      />
    </div>
  </div>
</template>
