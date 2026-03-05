import type { User } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const { name, password }: User = await readBody(event)

  const user = await db
    .insert(schema.users)
    .values({
      name,
      password,
      createdAt: new Date(),
    })
    .returning()
    .get()

  return {
    success: true,
    data: user,
    msg: '注册成功',
  }
})
