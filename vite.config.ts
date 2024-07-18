// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
// })
//

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { terser } from 'rollup-plugin-terser';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vitejs.dev/config/

export default ({ mode }: any) => {
  return defineConfig({
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
        mangle: {
          reserved: ['console'], // 如果你想保留其他 console 方法，请将它们添加到这个数组中
        },
      },
      target: ['chrome71'],
      // sourcemap: true, //
      sourcemap: false, //不要.js.map文件
      outDir: mode, // 指定输出路径，要和库的包区分开
      assetsDir: 'static/', // 指定生成静态资源的存放路径
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js1/[name]-[hash].js',
          entryFileNames: 'static/js2/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
        brotliSize: false, // 不统计
        target: 'esnext',
        minify: 'esbuild', // 混淆器，terser构建后文件体积更小
        presets: [
          [
            '@vue/cli-plugin-babel/preset',
            {
              useBuiltIns: 'entry',
            },
          ],
        ],
        plugins: [
          // "@vue/babel-plugin-jsx",
          // '@rollup/plugin-babel',
          terser({
            compress: {
              drop_console: true,
            },
            mangle: {
              reserved: ['console'], // 如果你想保留其他 console 方法，请将它们添加到这个数组中
            },
          }),
        ],
      },
    },

    plugins: [
      vue(),
      vueDevTools({
        launchEditor: 'webstorm',
      }),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router'],
      }),
      eslintPlugin({
        include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue'],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'), // 路径别名
        VIEWS: resolve(__dirname, 'src/views/layout'), // 路径别名
      },
      extensions: ['.js', '.json', '.ts', '.css'], // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    server: {
      port: 3006,
      open: false,
      host: '0.0.0.0',
      proxy: {
        '/request': {
          target: loadEnv(mode, process.cwd()).VITE_API_DOMAIN,
          changeOrigin: true,
          rewrite: (path: any) => path.replace(/^\/request/, ''),
        },
        '/homes': {
          target: loadEnv(mode, process.cwd()).VITE_API_HOME,
          changeOrigin: true,
          rewrite: (path: any) => path.replace(/^\/homes/, ''),
        },
        '/tools': {
          target: loadEnv(mode, process.cwd()).VITE_API_TOOL,
          changeOrigin: true,
          rewrite: (path: any) => path.replace(/^\/tools/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: `@import "./src/assets/";`
        },
      },
    },
    base: '/',
  });
};
