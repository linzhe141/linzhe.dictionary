import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const { content, image }: any = await readBody(event)

  const data = await db
    .update(schema.phrases)
    .set({
      content,
      image,
      updatedAt: new Date(),
    })
    .where(eq(schema.phrases.id, Number(id)))
    .returning()
    .get()

  return data
})
