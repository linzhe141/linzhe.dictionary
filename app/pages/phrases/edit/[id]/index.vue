<script setup lang="ts">
import PhraseForm from '../../components/PhraseForm.vue'

definePageMeta({
  layout: 'phrases-layout',
  middleware: 'auth',
})

const route = useRoute()
const phraseId = route.params.id as string
</script>

<template>
  <PhraseForm mode="edit" :phrase-id="phraseId" />
</template>
