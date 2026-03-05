import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const { nickname, bio, bgImage, avatarImage }: any = await readBody(event)
  const data = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, userId))
    .get()
  if (data) {
    const profile = await db
      .update(schema.profiles)
      .set({
        nickname,
        bio,
        bgImage,
        avatarImage,
      })
      .where(eq(schema.profiles.userId, userId))
      .returning()
      .get()

    return profile
  } else {
    const profile = await db
      .insert(schema.profiles)
      .values({
        nickname,
        bio,
        bgImage,
        avatarImage,
        userId,
      })
      .returning()
      .get()

    return profile
  }
})
