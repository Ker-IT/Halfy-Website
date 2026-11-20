import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { startServer } from "../server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const eleventyCmd = path.join(rootDir, "node_modules", "@11ty", "eleventy", "cmd.cjs");
const eleventyBin = path.join(rootDir, "node_modules", ".bin", "eleventy");

function main() {
  // 1. Bind port 3000 immediately in-process so health checks succeed without subprocess lag
  const server = startServer();

  // 2. Start Eleventy watch mode concurrently (initial build into _site/ + rebuild on edits)
  const useNodeCmd = fs.existsSync(eleventyCmd);
  const watcher = spawn(
    useNodeCmd ? process.execPath : eleventyBin,
    useNodeCmd ? [eleventyCmd, "--watch"] : ["--watch"],
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );

  let shuttingDown = false;

  function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    if (!watcher.killed) watcher.kill(signal);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 500).unref();
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  watcher.on("error", (err) => {
    console.error("[dev] Eleventy watcher error:", err);
  });

  watcher.on("exit", (code, signal) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[dev] Eleventy watcher exited unexpectedly (code=${code}, signal=${signal})`);
    }
  });
}

main();
