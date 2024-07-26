<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'

const state = reactive({
  name: undefined,
  password: undefined,
})
async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with event.data
  console.log(event.data)
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
            <UButton type="submit"> 登录 </UButton>
            <UButton type="submit"> 注册 </UButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
