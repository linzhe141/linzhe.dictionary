export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui'],

  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
    },
  },
  css: ['~/assets/css/main.css'],
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-04-25',

  hub: {
    database: true,
    cache: true,
    blob: true,
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
