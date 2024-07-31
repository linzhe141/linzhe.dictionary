export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const user = await useDrizzle().query.users.findFirst({
    where: eq(tables.users.id, userId),
    with: { profiles: true },
  })

  return user
})
