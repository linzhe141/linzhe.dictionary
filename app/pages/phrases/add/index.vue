<script setup lang="ts">
import PhraseForm from '../components/PhraseForm.vue'

definePageMeta({
  layout: 'phrases-layout',
  middleware: 'auth',
})
</script>

<template>
  <PhraseForm mode="add" />
</template>
