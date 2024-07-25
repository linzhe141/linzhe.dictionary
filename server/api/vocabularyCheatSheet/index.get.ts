export default eventHandler(async () => {
  const todos = await useDrizzle()
    .select()
    .from(tables.vocabularyCheatSheet)
    .all()

  return todos
})
