import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_'],
  base: '/Operation/',   // ★ ここを追加（/リポジトリ名/）
})
