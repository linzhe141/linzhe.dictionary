import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const profile = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.id, userId))
    .get()

  return profile
})
