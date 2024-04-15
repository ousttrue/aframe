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
