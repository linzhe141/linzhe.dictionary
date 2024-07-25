import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export { sql, eq, and, or } from 'drizzle-orm'
export type Todo = typeof schema.todos.$inferSelect
export type VocabularyCheatSheet =
  typeof schema.vocabularyCheatSheet.$inferSelect
