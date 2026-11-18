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
  },
  build: { outDir: "dist", sourcemap: true },
});
