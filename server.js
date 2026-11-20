/**
 * Development & Google AI Studio Preview Adapter ONLY.
 *
 * This Express server is NOT part of the production architecture.
 * In production, GitHub Pages serves the static `_site/` directory directly.
 * Here, it serves the Eleventy-generated `_site/` output on 0.0.0.0:3000.
 */
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.join(__dirname, "_site");

export function createPreviewApp() {
  const app = express();

  app.use(
    express.static(siteDir, {
      extensions: ["html"],
    })
  );

  // During a cold start before Eleventy finishes its initial build (~0.3s),
  // respond with HTTP 200 so readiness checks and preview tabs recover smoothly.
  app.use((req, res, next) => {
    if (req.method === "GET" && !fs.existsSync(path.join(siteDir, "index.html"))) {
      res
        .status(200)
        .type("html")
        .send(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="1"><title>Halfy Preview</title></head><body><p>Building preview...</p></body></html>'
        );
      return;
    }
    next();
  });

  return app;
}

export function startServer() {
  const app = createPreviewApp();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = "0.0.0.0";

  const server = app.listen(PORT, HOST, () => {
    console.log(`Halfy static preview (_site/) listening on http://${HOST}:${PORT}`);
  });

  server.on("error", (err) => {
    console.error("[preview] Server error:", err);
    process.exit(1);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
