import { type SQL, sql } from 'drizzle-orm'
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const vocabularyCheatSheet = sqliteTable('vocabulary_cheat_sheet', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  word: text('word').notNull(),
  symbols: text('symbols'),
  trans: text('trans').notNull(),
  userId: integer('user_id').references(() => users.id),
})
export function lower(data: AnySQLiteColumn): SQL {
  return sql`lower(${data})`
}

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    password: text('password').notNull(),
  },
  (table) => ({
    nameUniqueIndex: uniqueIndex('nameUniqueIndex').on(lower(table.name)),
  }),
)
