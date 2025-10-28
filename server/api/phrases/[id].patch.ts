export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const { content, image }: any = await readBody(event)

  const data = await useDrizzle()
    .update(tables.phrases)
    .set({
      content,
      image,
      updatedAt: new Date(),
    })
    .where(eq(tables.phrases.id, Number(id)))
    .returning()
    .get()

  return data
})
