import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  if (user) event.context.user = user
})

async function getUserFromSession(event: H3Event) {
  const cookie = getCookie(event, 'user')
  if (!cookie) return null
  const session = JSON.parse(cookie)
  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, session.id))
    .get()
  if (!user || user.name !== session.name) {
    return null
  }
  return user
}
