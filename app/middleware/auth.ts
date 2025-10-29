export default defineNuxtRouteMiddleware((to, from) => {
  console.group('auth middleware')
  console.info('to->', to)
  console.info('from->', from)
  console.groupEnd()

  const user = useCookie('user')
  if (!user.value) {
    const uri = to.fullPath
    return navigateTo('/login?redirect=' + encodeURIComponent(uri))
  }
})
