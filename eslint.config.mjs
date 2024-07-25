// @ts-check
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(eslintPluginPrettierRecommended, [
  {
    rules: {
      '@stylistic/arrow-parens': 'off',
      'vue/no-v-html': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@stylistic/operator-linebreak': 'off',
      '@stylistic/brace-style': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
