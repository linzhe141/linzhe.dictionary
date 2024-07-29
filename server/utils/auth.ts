import { type User } from './drizzle'

export async function isAuth(user: User | undefined) {
  if (!user) throw createError({ statusCode: 401 })
  const data = await useDrizzle()
    .select()
    .from(tables.users)
    .where(and(eq(tables.users.name, user.name), eq(tables.users.id, user.id)))
    .get()
  if (!data) throw createError({ statusCode: 401 })
  return true
}
