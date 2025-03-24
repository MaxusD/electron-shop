import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL)
    },
    base: '/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.REACT_APP_API_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    }
  }
})
