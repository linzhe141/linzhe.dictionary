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

export const vocabularyCheatSheet = sqliteTable(
  'vocabulary_cheat_sheet',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    word: text('word').notNull(),
    symbols: text('symbols'),
    trans: text('trans').notNull(),
  },
  (table) => ({
    wordUniqueIndex: uniqueIndex('wordUniqueIndex').on(lower(table.word)),
  }),
)
export function lower(data: AnySQLiteColumn): SQL {
  return sql`lower(${data})`
}
