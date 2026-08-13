import { createReadStream, existsSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mergeService = spawn(process.execPath, ["scripts/wisp_merge_service.mjs"], {
  cwd: root,
  stdio: "inherit",
});

function stopMergeService() {
  if (!mergeService.killed) mergeService.kill();
}

process.on("SIGINT", () => { stopMergeService(); process.exit(0); });
process.on("SIGTERM", () => { stopMergeService(); process.exit(0); });

const mimeTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".pdf": "application/pdf", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const requestedPath = normalize(join(root, relativePath));
  if (!requestedPath.startsWith(root)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }
  // Client-side signing routes are served by the SPA while assets remain direct files.
  const serveSpa = !extname(relativePath) && (!existsSync(requestedPath) || statSync(requestedPath).isDirectory());
  const filePath = serveSpa ? join(root, "index.html") : requestedPath;
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => console.log("EasyWISP is running at http://127.0.0.1:" + port));
