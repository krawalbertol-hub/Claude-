import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // En GitHub Pages el workflow pasa VITE_BASE=/Claude-/ ; en Netlify o dominio propio es '/'
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
  ssr: { noExternal: ['@fontsource-variable/space-grotesk', '@fontsource-variable/inter'] },
});
