export default eventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const deletedRow = await useDrizzle()
    .delete(tables.vocabularyCheatSheet)
    .where(and(eq(tables.vocabularyCheatSheet.id, Number(id))))
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
