<script setup lang="ts">
const router = useRouter()
const handleSpace = (e: KeyboardEvent) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault()
    router.push('/home')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleSpace)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleSpace)
})
</script>

<template>
  <div
    class="contrast-content flex h-screen flex-col items-center justify-center overflow-hidden bg-green-400"
  >
    <div className="flex flex-col items-center justify-center">
      <ULink to="/home" class="text-[#213547] hover:text-[#213547]">
        <div
          className="text-content relative flex flex-col items-center justify-center"
        >
          <div className="click-icon absolute right-[50px] top-[75px]">
            <svg
              width="32"
              height="32"
              fill="#213547"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M509.488762 407.210667l4.047238 1.462857 375.954286 146.968381a73.142857 73.142857 0 0 1-11.727238 139.727238l-4.242286 0.755809-130.852572 19.334096-13.458285 124.976762a73.142857 73.142857 0 0 1-136.728381 27.599238l-2.023619-3.974096-169.569524-355.815619a73.142857 73.142857 0 0 1 88.600381-101.034666z m-22.576762 69.583238l169.569524 355.815619 19.529143-181.248 186.831238-27.599238-375.954286-146.968381zM414.47619 170.666667c134.119619 0 242.95619 108.30019 243.809524 242.224762l-75.995428-29.720381a170.666667 170.666667 0 1 0-178.93181 201.630476l34.499048 72.387047c-7.704381 0.731429-15.481905 1.097143-23.381334 1.097143-134.656 0-243.809524-109.153524-243.809523-243.809524S279.82019 170.666667 414.47619 170.666667z"
                p-id="3348"
              ></path>
            </svg>
          </div>
          <h1 className="text-content mb-4 text-6xl">Dictionary</h1>
          <span className="text-content text-xl">好记性不如烂笔头</span>
        </div>
        <div class="gradient mt-2 h-2 w-[400px]"></div>
      </ULink>
    </div>
    <ULink to="/home">
      <div class="mt-12 flex items-center justify-center">
        <div
          class="spacebar relative flex h-10 w-32 items-center justify-center rounded-xl border-2 border-[#213547] text-[#213547]"
        >
          <div
            class="absolute inset-0 animate-pulse rounded-xl bg-[#213547]/5"
          ></div>
          <span class="mb-6 text-5xl tracking-wider opacity-60">⎵</span>
        </div>
      </div>
    </ULink>
  </div>
</template>

<style scoped>
@keyframes press {
  0%,
  100% {
    transform: translateY(0);
    box-shadow: 0 4px 0 #213547;
  }
  50% {
    transform: translateY(3px);
    box-shadow: 0 1px 0 #213547;
  }
}
.spacebar {
  animation: press 1.5s infinite ease-in-out;
}
</style>
