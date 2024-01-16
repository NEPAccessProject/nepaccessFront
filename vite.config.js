import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import commonjs from 'vite-plugin-commonjs'
import basicSsl from '@gadgetinc/vite-plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig((args) => {
  console.log(`file: vite.config.js:`, args);
  const {mode,command} = args;
  const env = loadEnv(mode, process.cwd(), '')
 console.log('VITE.JS CONFIG ENV',env);
  return {
      base: '/',
    plugins: [
    react(),
    commonjs(),
    // basicSsl({
    //   certDir: './reactcert',
    //   domains: ['localhost'],
    //   }),
  ],
  server: {
      open: true,
      port: 3000,
      hmr: true,
      https: false,
  },
  define: {
    __APP_ENV__: JSON.stringify(env.APP_ENV),
  },
}})