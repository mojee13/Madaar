import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative assets + HashRouter work at / and /any-repository/ without rewrites.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  preview: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  build: { target: 'es2022', sourcemap: false },
});
