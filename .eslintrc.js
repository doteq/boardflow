module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    'vuetify',
    'plugin:vue-i18n/recommended',
  ],
  plugins: [
    'vuetify',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    semi: ['error', 'always'],
    'import/order': ['error'],
    'import/prefer-default-export': 'off',
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue-i18n/no-raw-text': ['warn', {
      ignoreNodes: ['v-icon'],
    }],
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/locales/*.json',
    },
  },
};
