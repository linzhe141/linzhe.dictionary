import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const userId = event.context.user.id

  const data = await db
    .select()
    .from(schema.phrases)
    .where(
      and(eq(schema.phrases.userId, userId), eq(schema.phrases.id, Number(id))),
    )
    .limit(1)

  return data[0]
})
