import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@components': '/src/components',
      '@pages': '/src/pages',
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
  define: {
    'process.env': import.meta.env,
  },
});
