import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [react(), wasm()],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/globalStyles/variables.scss" as *;`, 
      },
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true, // Включает генерацию Source Maps
  },
});
