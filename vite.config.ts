import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vite Configuration
 * 
 * Configured for static hosting with hash-based routing.
 * The base path is '/' which works with GitHub Pages and most static hosts.
 * Hash routing (useHashLocation) ensures routes work without server-side configuration.
 */
export default defineConfig({
  base: '/', // <--- IMPORTANT: This must match your repo name exactly if you are not using a custom domain.
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: "../docs", // <--- Build goes UP one level, then into docs
    emptyOutDir: false, // Cleans the folder before building
  },
  server: {
    host: "0.0.0.0",
    hmr: {
      clientPort: 443,
      overlay: false,
    },
  },
});
