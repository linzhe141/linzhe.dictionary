export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  hub: {
    database: true,
  },
})
