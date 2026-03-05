export default eventHandler(async () => {
  const todos = await db.select().from(schema.todos).all()

  return todos
})
