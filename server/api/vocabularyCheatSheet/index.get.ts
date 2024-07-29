import { desc } from 'drizzle-orm'
import { isAuth } from '~~/server/utils/auth'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const todos = await useDrizzle()
    .select()
    .from(tables.vocabularyCheatSheet)
    .orderBy(desc(tables.vocabularyCheatSheet.id))
    .all()

  return todos
})
