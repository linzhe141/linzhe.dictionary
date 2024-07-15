<script setup lang="ts">
const list = [
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
  {
    word: 'card',
    phoneticSymbols: '/kɑrd/',
    meanings: [
      'n.信用卡, 贺卡, 插件, 怪人',
      'v.（用钢丝刷）梳理, 要求出示身份证（以确认年龄，如购酒时） 网络: 卡片,纸牌, 名片',
    ],
  },
]
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <UCard v-for="(item, index) in list" :key="item.word + index">
      <template #header>{{ item.word }}</template>
      <div>
        <span class="phonetic-symbols">{{ item.phoneticSymbols }}</span>
      </div>
      <div v-for="i of item.meanings" :key="i">{{ i }}</div>
    </UCard>
  </div>
</template>
