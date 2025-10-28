export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const { id } = getRouterParams(event)
  const userId = event.context.user.id

  const data = await useDrizzle()
    .select()
    .from(tables.phrases)
    .where(
      and(eq(tables.phrases.userId, userId), eq(tables.phrases.id, Number(id))),
    )
    .limit(1)

  return data[0]
})
