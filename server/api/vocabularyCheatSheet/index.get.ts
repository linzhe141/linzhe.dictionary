import { desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id

  const todos = await useDrizzle()
    .select()
    .from(tables.vocabularyCheatSheet)
    .where(eq(tables.vocabularyCheatSheet.userId, userId))
    .orderBy(desc(tables.vocabularyCheatSheet.id))
    .all()

  return todos
})
