export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const profile = await useDrizzle()
    .select()
    .from(tables.profiles)
    .where(eq(tables.profiles.id, userId))
    .get()

  return profile
})
