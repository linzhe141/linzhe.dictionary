import type { VocabularyCheatSheet } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const params: VocabularyCheatSheet[] = await readBody(event)
  const data = {
    error: [] as VocabularyCheatSheet[],
    success: [] as VocabularyCheatSheet[],
  }
  for (const item of params) {
    const { word, symbols, trans } = item
    const words = await useDrizzle()
      .select()
      .from(tables.vocabularyCheatSheet)
      .where(eq(tables.vocabularyCheatSheet.userId, userId))
      .all()
    if (words.find((i) => i.word === word)) {
      data.error.push(item)
    } else {
      await useDrizzle().insert(tables.vocabularyCheatSheet).values({
        word,
        symbols,
        trans,
        userId,
        createdAt: new Date(),
      })
      data.success.push(item)
    }
  }

  return {
    data,
  }
})
