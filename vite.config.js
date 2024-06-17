import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
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
      alias: { "@": path.resolve(__dirname, "src/") },
    }
  };
});
