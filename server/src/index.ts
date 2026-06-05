import { serve } from "bun";
import sql from "./db";

const server = serve({
  port: 3001,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/db") {
      try {
        const rows = await sql`SELECT NOW()`;
        return Response.json({ success: true, time: rows[0] });
      } catch (err) {
        return Response.json({ success: false, error: String(err) }, { status: 500 });
      }
    }

    return new Response("I'm a teapot", { status: 418 });
  },
});

console.log(`Server running at http://localhost:${server.port} — I'm a teapot!`);