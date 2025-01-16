import dayjs from 'dayjs'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const user = await useDrizzle().query.users.findFirst({
    where: eq(tables.users.id, userId),
    with: { profile: true },
  })
  const vocabulary = await useDrizzle().query.vocabularyCheatSheet.findMany({
    where: eq(tables.vocabularyCheatSheet.userId, userId),
  })
  const data = {
    createTime: dayjs(user?.createdAt).format('MMMM YYYY'),
    username: user?.name,
    nickname: user?.profile?.nickname,
    bio: user?.profile?.bio,
    bgImage: user?.profile?.bgImage,
    avatarImage: user?.profile?.avatarImage,
    vocabularySum: vocabulary.length,
  }
  return data
})
