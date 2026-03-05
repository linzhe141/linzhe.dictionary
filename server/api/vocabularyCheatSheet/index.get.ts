import { desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id

  const todos = await db
    .select()
    .from(schema.vocabularyCheatSheet)
    .where(eq(schema.vocabularyCheatSheet.userId, userId))
    .orderBy(desc(schema.vocabularyCheatSheet.id))
    .all()

  return todos
})
