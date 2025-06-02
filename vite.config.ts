import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),  // output at project root level, alongside backend folder
    emptyOutDir: true,
  },
});
