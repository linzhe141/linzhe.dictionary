<script setup lang="ts">
const user = useCookie('user')
// @ts-expect-error
const name = (user.value ?? {}).name
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
      class="fixed left-0 right-0 top-0 z-10 flex h-10 items-center bg-green-500 leading-10"
    >
      <h1 class="w-full text-center text-2xl text-white">
        <ULink to="/"> linzhe dictionary!!! </ULink>
      </h1>
      <ULink v-if="name" to="/profile">
        <UAvatar
          class="absolute right-2 top-1"
          :alt="name"
          src="https://pbs.twimg.com/profile_images/1679735939873267716/CY31ZbHn_reasonably_small.jpg"
        />
      </ULink>
    </div>
    <div class="mt-10"><slot /></div>
    <div class="fixed bottom-2 right-2" @click="toTop">
      <UIcon
        v-if="showIcon"
        name="i-heroicons-arrow-up-circle-16-solid"
        class="size-6 cursor-pointer text-green-400"
      />
    </div>
  </div>
</template>
