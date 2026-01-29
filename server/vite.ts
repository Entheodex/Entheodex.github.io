import { createServer as createViteServer } from "vite";
import type { Server } from "http";
import type { Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sets up Vite dev server middleware for Express in development mode.
 * This enables HMR (Hot Module Replacement) and serves the Vite dev server.
 * 
 * @param httpServer - The HTTP server instance
 * @param app - The Express application instance
 */
export async function setupVite(httpServer: Server, app: Express): Promise<void> {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        server: httpServer,
      },
    },
    root: path.resolve(__dirname, "..", "client"),
    appType: "spa",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "..", "client", "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
      },
    },
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);
}
