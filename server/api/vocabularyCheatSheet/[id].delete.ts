export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const deletedRow = await db
    .delete(schema.vocabularyCheatSheet)
    .where(and(eq(schema.vocabularyCheatSheet.id, Number(id))))
    .returning()
    .get()

  if (!deletedRow) {
    throw createError({
      statusCode: 404,
      message: 'Todo not found',
    })
  }
  return deletedRow
})
