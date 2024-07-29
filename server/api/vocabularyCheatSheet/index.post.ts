import { type VocabularyCheatSheet } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const { word, symbols, trans }: VocabularyCheatSheet = await readBody(event)
  const words = await useDrizzle()
    .select()
    .from(tables.vocabularyCheatSheet)
    .where(eq(tables.vocabularyCheatSheet.userId, userId))
    .all()
  if (words.find((i) => i.word === word)) {
    return {
      success: false,
      data: null,
      msg: '添加失败，该单词已添加至生词本，不可重复添加',
    }
  }
  const todo = await useDrizzle()
    .insert(tables.vocabularyCheatSheet)
    .values({
      word,
      symbols,
      trans: trans,
      userId,
    })
    .returning()
    .get()

  return {
    success: true,
    data: todo,
    msg: '添加成功',
  }
})
