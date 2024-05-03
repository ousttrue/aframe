/// <reference types="vitest" />
import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // react(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      // Web ソケット か socket.io をプロキシ化: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io/': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  },
  test: {
    setupFiles: ['./vitest-setup.js'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    include: [
      // 'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      'tests/utils/*.test.js',
    ]
  }
})
