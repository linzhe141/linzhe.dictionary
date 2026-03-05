import { desc, eq, count } from 'drizzle-orm'
import { db, schema } from 'hub:db'

export default eventHandler(async (event) => {
  await isAuth(event.context.user)
  const userId = event.context.user.id

  // 获取查询参数
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10)) // 限制最大100条

  // 计算偏移量
  const offset = (page - 1) * limit

  // 获取总数（使用 count 查询）
  const [{ total }] = await db
    .select({ total: count() })
    .from(schema.phrases)
    .where(eq(schema.phrases.userId, userId))

  // 获取当前页数据
  const data = await db
    .select()
    .from(schema.phrases)
    .where(eq(schema.phrases.userId, userId))
    .orderBy(desc(schema.phrases.id))
    .limit(limit)
    .offset(offset)

  // 计算总页数
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    total,
    totalPages,
    currentPage: page,
    pageSize: limit,
  }
})
