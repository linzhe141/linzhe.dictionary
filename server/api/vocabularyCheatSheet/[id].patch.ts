import type { VocabularyCheatSheet } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const { word, symbols, trans }: VocabularyCheatSheet = await readBody(event)

  const todo = await db
    .update(schema.vocabularyCheatSheet)
    .set({
      word,
      symbols,
      trans,
    })
    .where(eq(schema.vocabularyCheatSheet.id, Number(id)))
    .returning()
    .get()

  return todo
})
