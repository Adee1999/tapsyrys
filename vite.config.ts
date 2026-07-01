import { defineConfig } from 'vite';

export default defineConfig({
  // Hostinger-де subdomain үшін root path жеткілікті
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
