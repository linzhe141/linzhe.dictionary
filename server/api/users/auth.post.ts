import type { User } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const { name, password }: User = await readBody(event)

  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.name, name))
    .get()
  if (!user || user.password !== password) {
    return {
      success: false,
      data: null,
      msg: '密码或帐号不正确',
    }
  }
  return user
})
