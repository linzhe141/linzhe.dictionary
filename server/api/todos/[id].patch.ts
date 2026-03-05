export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { completed }: { completed: boolean } = await readBody(event)

  const todo = await db
    .update(schema.todos)
    .set({
      completed,
    })
    .where(eq(schema.todos.id, Number(id)))
    .returning()
    .get()

  return todo
})
