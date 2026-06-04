import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  preview: {
    port: 4173,
    strictPort: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    globals: true,
    css: true,
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**']
  }
});
