import { fileURLToPath, URL } from 'node:url'
// import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import styleImport from 'vite-plugin-style-import';
import path from 'path';
// import dotenv from 'dotenv';

// .env.production 파일 로드
// dotenv.config({ path: '.env.production' });

const filename = fileURLToPath(import.meta.url);
const pathSegments = path.dirname(filename);

console.log('pathSegments:', pathSegments);
console.log(fileURLToPath(new URL('./src', import.meta.url)));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
  ],
  server: {
    // Vite 서버의 포트 설정

    // 정적 파일을 서빙할 디렉토리 설정
    // serve: {
    //     // Vite이 정적 파일을 서빙할 디렉토리 설정
    //     base: '/public'
    // }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // '$': path.resolve(__dirname, '/src'),
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'views': path.resolve(__dirname, '/src/views'),
      // '@@': fileURLToPath(new URL('/src', import.meta.url)),
      // `~` 기호를 사용하여 패키지를 가져오기 위한 별칭을 설정합니다.
      '~': path.resolve(__dirname, 'node_modules'), // 프로젝트의 src 디렉토리를 가리킵니다.
      // 추가적인 별칭 설정...
      // 'import.meta.env': JSON.stringify(process.env),
    },
    extensions: ['.tsx', '.ts', '.js', '.vue'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // CoreUI 프로 라이브러리의 SCSS 파일 경로를 추가합니다.
        // additionalData: `@import '@coreui/coreui-pro/dist/css/coreui-pro.css';`,
      },
    },
  },  
})
