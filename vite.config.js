import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(),commonjs()],
  server: {
      open: true,
      port: 3001,
      hmr: true,
      https: false,
  }
})