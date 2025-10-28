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
  compatibilityDate: '2025-08-15',
  nitro: {
    rollupConfig: {
      external: (id) => {
        return (
          (id.startsWith('node:') && !id.includes('node:tty')) ||
          id === 'picomatch' ||
          id === 'anymatch'
        )
      },
    },
  },

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
