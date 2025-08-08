import type { CET6_WORD, GithubWord, Word } from '~~/types'

function formatCET(data: CET6_WORD[]): Word[] {
  return data.map((i) => ({
    word: i.headWord,
    symbols: i.content.word.content.ukphone,
    trans: i.content.word.content.trans.map(
      (item) => `${item.pos}. ${item.tranCn}`,
    ),
    examples: i.content.word.content.sentence?.sentences?.map((item) => ({
      sentence: item.sContent,
      trans: item.sCn,
    })),
  }))
}
function formatWords(data: GithubWord[]) {
  return data.map((i) => ({
    word: i.word,
    symbols: i.symbols,
    trans: [`${i.part} ${i.mean}`],
    examples: [{ sentence: i.ex, trans: i.tran }],
  }))
}
export default defineComponent({
  setup() {
    const dictionaryRef = ref<Word[]>([])
    provide('dictionaryRef', dictionaryRef)

    onMounted(async () => {
      const [data1, data2, data3, data4] = (await Promise.all([
        $fetch('/words/cet6-1.json'),
        $fetch('/words/cet6-2.json'),
        $fetch('/words/cet6-3.json'),
        $fetch('/words/words.json'),
      ])) as [CET6_WORD[], CET6_WORD[], CET6_WORD[], GithubWord[]]
      const dictionary: Word[] = [
        ...formatWords(data4),
        ...formatCET(data1),
        ...formatCET(data2),
        ...formatCET(data3),
      ].map((i) => ({ ...i, showMeaning: true }))
      dictionaryRef.value = dictionary
    })
    const slots = useSlots()
    return () => slots.default!()
  },
})
