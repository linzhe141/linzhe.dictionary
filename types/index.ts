/* eslint-disable @stylistic/member-delimiter-style */
export type Word = {
  word: string
  colorWord?: string
  symbols: string
  trans: string[]
  examples: Example[]
  showMeaning?: boolean
}
export type Example = {
  sentence: string
  trans: string
}

export type CET6_WORD = {
  wordRank: number
  headWord: string
  content: {
    word: {
      wordHead: string
      wordId: string
      content: {
        sentence: {
          sentences: { sContent: string; sCn: string }[]
          desc: string
        }
        usphone: string
        syno: {
          synos: { pos: string; tran: string; hwds: { w: string }[] }[]
          desc: string
        }
        ukphone: string
        ukspeech: string
        star: number
        phone: string
        speech: string
        relWord: {
          rels: { pos: string; words: { hwd: string; tran: string }[] }[]
          desc: string
        }
        usspeech: string
        trans: {
          tranCn: string
          descOther: string
          descCn: string
          pos: string
          tranOther: string
        }[]
      }
    }
  }
  bookId: string
}

export type GithubWord = {
  id: number
  word: string
  symbols: string
  part: string
  mean: string
  ex: string
  tran: string
}
