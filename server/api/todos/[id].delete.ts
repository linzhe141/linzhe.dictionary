export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const deletedTodo = await db
    .delete(schema.todos)
    .where(and(eq(schema.todos.id, Number(id))))
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
