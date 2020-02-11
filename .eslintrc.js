module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    // 'plugin:vue/strongly-recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-mixed-spaces-and-tabs': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true
    }],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
