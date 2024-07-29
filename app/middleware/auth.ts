export default defineNuxtRouteMiddleware(() => {
  const user = useCookie('user')
  if (!user.value) {
    return navigateTo('/login')
  }
})
