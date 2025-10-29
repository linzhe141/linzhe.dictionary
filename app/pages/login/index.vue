<script lang="ts" setup>
const route = useRoute()
const state = reactive({
  name: undefined,
  password: undefined,
})
const loginBtnDisabled = ref(false)
const registerBtnDisabled = ref(false)
const toast = useToast()
async function registerHandle() {
  try {
    registerBtnDisabled.value = true
    const data = await $fetch('/api/users', { method: 'POST', body: state })
    toast.add({
      title: data?.msg,
      color: data?.success ? 'primary' : 'error',
    })
  } catch (e) {
    toast.add({
      title: '注册失败',
      color: 'error',
    })
  }
  registerBtnDisabled.value = false
}
async function onSubmit() {
  try {
    loginBtnDisabled.value = true
    const data = await $fetch('/api/users/auth', {
      method: 'POST',
      body: state,
    })
    if (data?.success) {
      // @ts-expect-error
      const redirect: string = route.query.redirect ?? ''
      if (redirect) navigateTo(decodeURIComponent(redirect))
      else navigateTo('/home')
    }
    loginBtnDisabled.value = false
    toast.add({
      title: data?.msg,
      color: data?.success ? 'primary' : 'error',
    })
  } finally {
    loginBtnDisabled.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo 和标题区域 -->
      <div class="mb-8 text-center">
        <div class="mb-6 flex justify-center">
          <div class="relative">
            <img
              class="shadow-primary/20 h-16 w-16 rounded-2xl shadow-lg transition-transform hover:scale-105"
              src="/icon.png"
              alt="Dictionary Logo"
            />
          </div>
        </div>
        <h1 class="mb-2 text-3xl font-bold tracking-tight text-white">
          欢迎回来
        </h1>
        <p class="text-sm text-gray-400">登录到 Dictionary 继续学习</p>
      </div>

      <!-- 登录卡片 -->
      <UCard class="backdrop-blur-sm">
        <UForm :state="state" class="space-y-5" @submit="onSubmit">
          <UFormField
            label="用户名"
            name="name"
            :ui="{ label: 'text-sm font-medium text-gray-300' }"
          >
            <UInput
              v-model="state.name"
              class="w-full"
              size="lg"
              placeholder="请输入用户名"
            />
          </UFormField>

          <UFormField
            label="密码"
            name="password"
            :ui="{ label: 'text-sm font-medium text-gray-300' }"
          >
            <UInput
              v-model="state.password"
              class="w-full"
              type="password"
              size="lg"
              placeholder="请输入密码"
            />
          </UFormField>

          <div class="space-y-3 pt-2">
            <UButton type="submit" :disabled="loginBtnDisabled" size="lg" block>
              <span class="font-medium">登录</span>
            </UButton>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-800"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="bg-gray-900 px-2 text-gray-500">或</span>
              </div>
            </div>

            <UButton
              :disabled="registerBtnDisabled"
              size="lg"
              block
              @click="registerHandle"
            >
              <span class="font-medium">创建新账户</span>
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- 底部提示 -->
      <div class="mt-6 text-center text-xs text-gray-500">
        登录即表示你同意我们的服务条款和隐私政策
      </div>
    </div>
  </div>
</template>
