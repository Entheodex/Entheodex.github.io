import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Use standard console.log instead of the missing 'log' export
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  // Pass the Express app to registerRoutes to handle the Bio-Clock API
  const server = registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (app.get("env") === "development") {
    await setupVite(server, app);
  } else {
    const distPath = path.resolve(process.cwd(), "dist", "public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    }
  }
  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[server] serving on port ${PORT}`);
  });
})();