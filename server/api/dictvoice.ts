import { URL } from 'url'
import { sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const urlString = getRequestURL(event)
  const url = new URL(urlString)
  const word = url.searchParams.get('word') ?? ''
  const dictvoiceUrl = 'https://dict.youdao.com/dictvoice?type=2&audio='
  const data: ReadableStream = await $fetch(dictvoiceUrl + word, {
    responseType: 'stream',
  })
  console.log(data)

  return sendStream(event, data)
})
