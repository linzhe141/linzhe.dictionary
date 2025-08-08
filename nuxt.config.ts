export default defineNuxtConfig({
  compatibilityDate: '2025-04-25',
  future: { compatibilityVersion: 4 },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
    },
  },
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui'],
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  hub: {
    database: true,
    cache: true,
    blob: true,
  },
})
