<script setup lang="ts"></script>

<template>
  <div>
    <!-- 顶部导航栏 -->
    <header
      class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      :class="[
        'bg-gray-900/95',
        'shadow-primary/5 border-b border-gray-800 shadow-lg backdrop-blur-lg',
      ]"
    >
      <div class="mx-auto max-w-7xl px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo 区域 -->
          <LogoLink></LogoLink>

          <!-- 右侧功能区（可扩展） -->
          <div class="flex items-center gap-2">
            <!-- 预留位置，可添加搜索、用户菜单等 -->
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="min-h-screen pt-16">
      <slot />
    </main>
  </div>
</template>
