import { desc } from 'drizzle-orm'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id

  const data = await useDrizzle()
    .select()
    .from(tables.phrases)
    .where(eq(tables.phrases.userId, userId))
    .orderBy(desc(tables.phrases.id))
    .all()

  return data
})
