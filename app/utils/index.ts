export async function playAudio(word: string) {
  const { data } = await useFetch('/api/dictvoice', {
    query: { word },
    responseType: 'blob',
  })
  const blobUrl = URL.createObjectURL(data.value as Blob)
  const audio = new Audio(blobUrl)
  audio.play()
}
