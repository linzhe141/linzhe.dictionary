import type { VocabularyCheatSheet } from '~~/server/utils/drizzle'
import { db, schema } from 'hub:db'

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
    const words = await db
      .select()
      .from(schema.vocabularyCheatSheet)
      .where(eq(schema.vocabularyCheatSheet.userId, userId))
      .all()
    if (words.find((i) => i.word === word)) {
      data.error.push(item)
    } else {
      await db.insert(schema.vocabularyCheatSheet).values({
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
