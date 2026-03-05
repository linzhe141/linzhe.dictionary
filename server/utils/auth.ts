import type { User } from './drizzle'

export async function isAuth(user: User | undefined) {
  if (!user) throw createError({ statusCode: 401 })
  const data = await db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.name, user.name), eq(schema.users.id, user.id)))
    .get()
  if (!data) throw createError({ statusCode: 401 })
  return true
}
