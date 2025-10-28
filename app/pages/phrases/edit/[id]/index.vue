<script setup lang="ts">
import PhraseForm from '../../components/PhraseForm.vue'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const phraseId = route.params.id as string
</script>

<template>
  <PhraseForm mode="edit" :phrase-id="phraseId" @saved="() => router.go(-1)" />
</template>
