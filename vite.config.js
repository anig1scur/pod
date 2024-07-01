import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig(({ }) => {
  return {
    base: process.env.GITHUB_ACTIONS === '1' ? '/pod/' : '/',
    define: {
      _global: ({}),
    },
    server: {
      hmr: true
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "public/assets/"),
        "@": path.resolve(__dirname, "src/"),
      },
    }
  };
});
