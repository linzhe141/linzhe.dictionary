export { sql, eq, and, or } from 'drizzle-orm'
export type Todo = typeof schema.todos.$inferSelect
export type VocabularyCheatSheet =
  typeof schema.vocabularyCheatSheet.$inferSelect
export type User = typeof schema.users.$inferSelect
export type Profile = typeof schema.profiles.$inferSelect
export type Phrase = typeof schema.phrases.$inferSelect
