<script setup lang="ts"></script>

<template>
  <div>
    <div class="p-2">
      <UCard>
        <ULink
          to="/vocabulary-book"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          生词本
        </ULink>
      </UCard>
    </div>
    <div class="p-2">
      <div class="flex items-center">
        <div>生词：</div>
        <UInput
          class="ml-2 flex-1"
          color="primary"
          variant="outline"
          placeholder="请输入..."
        />
      </div>
      <div>
        <UButton class="mt-2 text-white" block>添加</UButton>
      </div>
    </div>
  </div>
</template>
