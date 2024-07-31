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
      color: data?.success ? 'primary' : 'red',
    })
  } catch (e) {
    toast.add({
      title: '注册失败',
      color: 'red',
    })
  }
  registerBtnDisabled.value = false
}
async function onSubmit() {
  loginBtnDisabled.value = true
  const data = await $fetch('/api/users/auth', { method: 'POST', body: state })
  if (data?.success) {
    // @ts-expect-error
    const callback: string = route.query.callback ?? ''
    if (callback) navigateTo(callback)
    else navigateTo('/home')
  }
  loginBtnDisabled.value = false
  toast.add({
    title: data?.msg,
    color: data?.success ? 'primary' : 'red',
  })
}
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center space-y-4">
    <img class="w-[60px] rounded-lg" src="/icon.png" />
    <div class="text-2xl">登录到 linzhe dictionary</div>
    <UCard>
      <div class="flex w-[300px] flex-col items-center">
        <UForm :state="state" class="w-full space-y-4" @submit="onSubmit">
          <UFormGroup label="用户名" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup label="密码" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>

          <div class="flex justify-between">
            <UButton type="submit" :disabled="loginBtnDisabled"> 登录 </UButton>
            <UButton :disabled="registerBtnDisabled" @click="registerHandle">
              注册
            </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
