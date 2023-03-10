import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      //outDir: 'dist/main'
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      //outDir: 'dist/preload'
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@srcside': resolve('src/renderer/srcside')
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [IconsResolver({ prefix: false })]
      }),
      Icons({ autoInstall: true })
    ],

    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          side: resolve(__dirname, 'src/renderer/side.html')
        }
      }
      //outDir: resolve(__dirname, 'dist/renderer')
    }
  }
})
