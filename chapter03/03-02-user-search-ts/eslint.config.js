import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  { ignores: ['dist', 'build', 'node_modules', '*.config.js', '*.config.ts'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks 규칙 (필수적인 것들만)
      ...reactHooks.configs.recommended.rules,
      
      // React Refresh 규칙 (개발 편의성)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript 규칙들을 느슨하게 조정
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      '@typescript-eslint/no-explicit-any': 'warn', // error에서 warn으로
      '@typescript-eslint/no-non-null-assertion': 'off', // 완전히 끄기
      '@typescript-eslint/ban-ts-comment': 'warn', // error에서 warn으로
      '@typescript-eslint/no-empty-function': 'warn', // error에서 warn으로
      '@typescript-eslint/prefer-const': 'warn', // error에서 warn으로
      
      // JavaScript 기본 규칙들 느슨하게
      'no-console': 'off', // 콘솔 로그 허용
      'no-debugger': 'warn', // error에서 warn으로
      'no-unused-vars': 'off', // TypeScript 버전을 사용하므로 끄기
      'no-undef': 'off', // TypeScript가 처리하므로 끄기
      
      // 코딩 스타일 관련 - 경고 수준으로
      'prefer-const': 'warn',
      'no-var': 'warn',
      
      // React 관련 - 필요한 것들만 경고 수준으로
      'react-hooks/exhaustive-deps': 'warn', // error에서 warn으로
    },
  },
  // JavaScript 파일들에 대한 별도 설정 (더 느슨하게)
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn',
      'no-debugger': 'warn',
    },
  },
]);