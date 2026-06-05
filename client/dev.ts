import { serve } from "bun";

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".ts": "text/javascript",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = serve({
  port: 5173,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;

    const file = Bun.file(`.${path}`);

    if (await file.exists()) {
      const ext = path.slice(path.lastIndexOf("."));
      const contentType = MIME[ext] ?? "application/octet-stream";

      if (ext === ".ts") {
        const result = await Bun.build({
          entrypoints: [`.${path}`],
          target: "browser",
          format: "esm",
        });
        const code = await result.outputs[0]?.text();
        return new Response(code ?? "", {
          headers: { "Content-Type": "text/javascript" },
        });
      }

      return new Response(file, {
        headers: { "Content-Type": contentType },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Dev server running at http://localhost:${server.port}`);
