import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/react-study-claude/chapter04/04-01-realtime-search-ts/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  esbuild: {
    jsxInject: "import React from 'react'"
  }
})