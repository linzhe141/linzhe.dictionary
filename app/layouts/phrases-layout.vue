<script setup lang="ts"></script>

<template>
  <div
    class="mx-auto min-h-screen max-w-[842px] border-r border-l border-[#2f3336] pb-4"
  >
    <!-- 顶部导航栏 -->
    <div
      class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[#2f3336] bg-black/80 px-4 backdrop-blur-sm"
    >
      <div class="flex items-center gap-4">
        <RouterBack></RouterBack>
        <h1 class="text-lg font-semibold">短语 / 口语搭配</h1>
      </div>
    </div>
    <slot></slot>
    <LogoLink
      class="fixed top-[100px] -translate-x-[300px] rotate-90"
    ></LogoLink>
  </div>
</template>
