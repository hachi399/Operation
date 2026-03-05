import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_API_KEY': JSON.stringify(process.env.VITE_API_KEY || '')
  },
  plugins: [react()],
  envPrefix: ['VITE_', 'API_'],
  base: '/Operation/',   // ★ ここを追加（/リポジトリ名/）
})
