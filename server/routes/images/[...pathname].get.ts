import { blob } from 'hub:blob'

export default eventHandler(async (event) => {
  const { pathname } = getRouterParams(event)

  return blob.serve(event, pathname)
})
