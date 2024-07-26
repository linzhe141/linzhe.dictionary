import type { User } from '~~/server/utils/drizzle'

export default eventHandler(async (event) => {
  const { name, password }: User = await readBody(event)

  const user = await useDrizzle()
    .insert(tables.users)
    .values({
      name,
      password,
    })
    .returning()
    .get()

  return user
})
