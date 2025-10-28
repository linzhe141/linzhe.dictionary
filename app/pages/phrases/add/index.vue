<script setup lang="ts">
import PhraseForm from '../components/PhraseForm.vue'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
</script>

<template>
  <PhraseForm mode="add" @saved="() => router.go(-1)" />
</template>
