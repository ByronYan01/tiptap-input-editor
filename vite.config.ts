import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    legacy({
      targets: ["Chrome 63"],
      // additionalLegacyPolyfills: ["core-js/modules/es.promise.js"], // 引入 Promise 的 polyfill
      modernPolyfills: true
      // renderModernChunks: false
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
