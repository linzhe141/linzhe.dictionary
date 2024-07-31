export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const { nickname, bio, bgImage, avatarImage }: any = await readBody(event)
  const data = await useDrizzle()
    .select()
    .from(tables.profiles)
    .where(eq(tables.profiles.userId, userId))
    .get()
  if (data) {
    const profile = await useDrizzle()
      .update(tables.profiles)
      .set({
        nickname,
        bio,
        bgImage,
        avatarImage,
      })
      .where(eq(tables.profiles.userId, userId))
      .returning()
      .get()

    return profile
  } else {
    const profile = await useDrizzle()
      .insert(tables.profiles)
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
