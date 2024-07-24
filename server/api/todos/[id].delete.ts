export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const deletedTodo = await useDrizzle()
    .delete(tables.todos)
    .where(and(eq(tables.todos.id, Number(id))))
    .returning()
    .get()

  if (!deletedTodo) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found',
    })
  }
  return deletedTodo
})
