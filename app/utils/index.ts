import { v4 as uuidv4 } from 'uuid'

const audioCache = new Map<string, string>()

export async function playAudio(word: string) {
  let blobUrl = audioCache.get(word)

  if (!blobUrl) {
    const { data } = await useFetch('/api/dictvoice', {
      query: { word },
      responseType: 'blob',
    })
    blobUrl = URL.createObjectURL(data.value as Blob)
    audioCache.set(word, blobUrl)

    setTimeout(
      () => {
        URL.revokeObjectURL(blobUrl!)
        audioCache.delete(word)
      },
      5 * 60 * 1000,
    )
  }

  const audio = new Audio(blobUrl)
  audio.play()
}

export async function dataUrlToFile(dataUrl: string): Promise<File> {
  const res: Response = await fetch(dataUrl)
  const blob: Blob = await res.blob()
  return new File([blob], uuidv4(), { type: 'image/png' })
}

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await $fetch('/api/files', {
    method: 'POST',
    body: formData,
  })
  return data
}
