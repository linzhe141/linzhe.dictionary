import type { Phrase } from '~~/server/utils/drizzle'
import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id
  const { content, image }: Phrase = await readBody(event)

  const data = await db
    .insert(schema.phrases)
    .values({
      content,
      image,
      userId,
      createdAt: new Date(),
    })
    .returning()
    .get()

  return {
    success: true,
    data: data,
    msg: '添加成功',
  }
})
