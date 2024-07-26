import { desc } from 'drizzle-orm'

export default eventHandler(async () => {
  const todos = await useDrizzle()
    .select()
    .from(tables.vocabularyCheatSheet)
    .orderBy(desc(tables.vocabularyCheatSheet.id))
    .all()

  return todos
})
