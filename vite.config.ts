import {defineConfig} from 'vite'
import {devtools} from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import {tanstackRouter} from '@tanstack/router-plugin/vite'
import {fileURLToPath, URL} from 'node:url'
import {visualizer} from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    visualizer({
      open: true,
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
