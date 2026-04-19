import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      injectRegister: "auto",
      manifest: false,
      devOptions: {
        enabled: true
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,json,png,ico}"]
      }
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
