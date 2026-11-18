import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/components/*": fileURLToPath(new URL("./src/components/*", import.meta.url)),
      "@/pages/*": fileURLToPath(new URL("./src/pages/*", import.meta.url)),
      "@/lib/*": fileURLToPath(new URL("./src/lib/*", import.meta.url)),
      "@/styles/*": fileURLToPath(new URL("./src/styles/*", import.meta.url))
    },
  },
  server: {
    port: 3000,
    host: "127.0.0.1",
    // Previewed through tunnels/proxies whose Host is not localhost; Vite 8
    // rejects those with a 403 "Blocked request" unless allowed. This dev
    // server is a local design preview (no data, no credentials). To tighten,
    // replace `true` with the exact preview hostname, e.g. [".trycloudflare.com"].
    allowedHosts: true,
    // Dev-only forward: the browser calls /api (and /go) on the dev server;
    // Vite proxies to the local control plane. Override the target
    // with VITE_API_TARGET if you run the backend elsewhere.
    proxy: {
      "/api": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
      "/go": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
      "/health": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
    },
  },
  base: "./",
  build: { outDir: "dist", sourcemap: true },
  preview: {
    port: 3100,
    // The preview server serves the built bundle; without the proxy the app
    // loads but cannot reach the backend, so the advertised "preview the
    // release" flow would be a blank demo. Same proxy as dev.
    proxy: {
      "/api": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
      "/go": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
      "/health": { target: process.env.VITE_API_TARGET ?? "http://127.0.0.1:8787", changeOrigin: true },
    },
  },
});
