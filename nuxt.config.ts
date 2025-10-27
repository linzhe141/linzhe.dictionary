export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/ui'],

  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
    },
  },
  css: ['~/assets/css/main.css'],
  future: { compatibilityVersion: 5 },
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
    bindings: {
      compatibilityDate: '2025-08-15',
      compatibilityFlags: [
        'nodejs_compat',
        'enable_nodejs_http_modules',
        'enable_nodejs_http_server_modules',
      ],
    },
  },
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
