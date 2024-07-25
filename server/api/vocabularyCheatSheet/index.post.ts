import { type VocabularyCheatSheet } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const { word, symbols, trans }: VocabularyCheatSheet = await readBody(event)

  try {
    const todo = await useDrizzle()
      .insert(tables.vocabularyCheatSheet)
      .values({
        word,
        symbols,
        trans: trans,
      })
      .returning()
      .get()

    return {
      success: true,
      data: todo,
      msg: '添加成功',
    }
  } catch (e) {
    const err = e as Error
    console.log(err.message)
    if (err.message.includes('UNIQUE constraint')) {
      return {
        success: false,
        data: null,
        msg: '添加失败，该单词已添加至生词本，不可重复添加',
      }
    }
  }
})
