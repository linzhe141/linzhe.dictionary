export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    with: { profile: true },
  })

  return user
})
