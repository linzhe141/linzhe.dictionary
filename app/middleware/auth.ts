export default defineNuxtRouteMiddleware(() => {
  const user = useCookie('user')
  if (!user.value) {
    const uri = location.pathname.slice(1) + location.search
    return navigateTo('/login?redirect=' + encodeURIComponent(uri))
  }
})
