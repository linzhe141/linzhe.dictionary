export default eventHandler(async (event) => {
  const { content }: { content: string } = await readBody(event)

  const todo = await useDrizzle()
    .insert(tables.todos)
    .values({
      content,
      createdAt: new Date(),
    })
    .returning()
    .get()

  return todo
})
