module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    // 느슨한 ESLint 설정 (초보자 친화적)
    'indent': ['warn', 2],
    'linebreak-style': ['warn', 'unix'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-undef': 'error',
    'no-trailing-spaces': 'warn',
    'eol-last': 'warn',
    'comma-dangle': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'space-before-function-paren': 'off',
    'keyword-spacing': 'warn',
    'space-infix-ops': 'warn',
    'no-multiple-empty-lines': ['warn', { max: 2 }]
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
};