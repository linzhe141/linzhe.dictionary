import { type VocabularyCheatSheet } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const { word, symbols, trans }: VocabularyCheatSheet = await readBody(event)

  const todo = await useDrizzle()
    .update(tables.vocabularyCheatSheet)
    .set({
      word,
      symbols,
      trans,
    })
    .where(eq(tables.vocabularyCheatSheet.id, Number(id)))
    .returning()
    .get()

  return todo
})
