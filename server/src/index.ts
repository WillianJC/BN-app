import type { SQL } from "bun";
import sql from "./db.ts";

const CLIENT_DIR = "./client";

// ── DB Schema ──
async function initDB(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      dni TEXT UNIQUE NOT NULL,
      pin TEXT NOT NULL,
      name TEXT NOT NULL,
      balance NUMERIC(12,2) DEFAULT 0,
      pension_amount NUMERIC(12,2) DEFAULT 500,
      pension_deposited BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      type TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS withdrawal_codes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      code TEXT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// ── Seed default user ──
async function seedUser(): Promise<void> {
  const existing = await sql`SELECT id FROM users WHERE dni = '12345678'`;
  if (existing.length > 0) return;

  await sql`
    INSERT INTO users (dni, pin, name, balance, pension_amount, pension_deposited)
    VALUES ('12345678', '0000', 'Manuel Torres', 450.00, 500.00, TRUE)
  `;
}

// ── Auth ──
async function login(req: Request): Promise<Response> {
  const { dni, pin } = await req.json() as { dni: string; pin: string };

  if (!dni || dni.length !== 8 || !pin || pin.length !== 4) {
    return Response.json({ success: false, error: "DNI y PIN requeridos" }, { status: 400 });
  }

  const users = await sql`SELECT id, name, balance FROM users WHERE dni = ${dni} AND pin = ${pin}`;

  if (users.length === 0) {
    return Response.json({ success: false, error: "Credenciales invalidas" }, { status: 401 });
  }

  const user = users[0] as { id: number; name: string; balance: string };
  return Response.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      balance: parseFloat(user.balance),
    },
  });
}

// ── Balance ──
async function getBalance(userId: number): Promise<Response> {
  const users = await sql`
    SELECT balance, pension_amount, pension_deposited FROM users WHERE id = ${userId}
  `;
  if (users.length === 0) {
    return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  const u = users[0] as { balance: string; pension_amount: string; pension_deposited: boolean };
  return Response.json({
    success: true,
    balance: parseFloat(u.balance),
    pensionAmount: parseFloat(u.pension_amount),
    pensionDeposited: u.pension_deposited,
  });
}

// ── Withdraw ──
async function createWithdrawalCode(userId: number, req: Request): Promise<Response> {
  const { amount } = await req.json() as { amount: number };

  if (!amount || amount < 10 || amount > 2000) {
    return Response.json({ success: false, error: "Monto invalido (10-2000)" }, { status: 400 });
  }

  const users = await sql`SELECT balance FROM users WHERE id = ${userId}`;
  if (users.length === 0) {
    return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  const balance = parseFloat((users[0] as { balance: string }).balance);
  if (amount > balance) {
    return Response.json({ success: false, error: "Saldo insuficiente" }, { status: 400 });
  }

  const code = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  await sql`
    INSERT INTO withdrawal_codes (user_id, code, amount, expires_at)
    VALUES (${userId}, ${code}, ${amount}, ${expiresAt.toISOString()})
  `;

  await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`;
  await sql`
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES (${userId}, 'withdrawal', ${amount}, 'Retiro sin tarjeta - Codigo Agente')
  `;

  return Response.json({
    success: true,
    code,
    amount,
    expiresAt: expiresAt.toISOString(),
  });
}

// ── Payments ──
async function processPayment(userId: number, req: Request): Promise<Response> {
  const { service, amount } = await req.json() as { service: string; amount: number };

  if (!service || !amount) {
    return Response.json({ success: false, error: "Servicio y monto requeridos" }, { status: 400 });
  }

  const users = await sql`SELECT balance FROM users WHERE id = ${userId}`;
  if (users.length === 0) {
    return Response.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  const balance = parseFloat((users[0] as { balance: string }).balance);
  if (amount > balance) {
    return Response.json({ success: false, error: "Saldo insuficiente" }, { status: 400 });
  }

  await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`;
  await sql`
    INSERT INTO transactions (user_id, type, amount, description)
    VALUES (${userId}, 'payment', ${amount}, ${`Pago de ${service}`})
  `;

  return Response.json({
    success: true,
    transactionId: Date.now(),
    service,
    amount,
  });
}

// ── SOS ──
async function triggerSOS(userId: number): Promise<Response> {
  await sql`
    INSERT INTO sos_alerts (user_id) VALUES (${userId})
  `;

  return Response.json({
    success: true,
    alertId: Date.now(),
    message: "Alerta de auxilio activada. Un asesor lo contactara en breve.",
  });
}

// ── Schedule ──
function getSchedule(): Response {
  return Response.json({
    success: true,
    month: "Junio 2026",
    schedule: [
      { dniEnds: "0 - 1", date: "Lunes 8" },
      { dniEnds: "2 - 3", date: "Martes 9" },
      { dniEnds: "4 - 5", date: "Miercoles 10" },
      { dniEnds: "6 - 7", date: "Jueves 11" },
      { dniEnds: "8 - 9", date: "Viernes 12" },
    ],
  });
}

// ── Static file serving ──
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ts": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

async function serveStatic(path: string): Promise<Response> {
  if (path.includes("..")) return new Response("Forbidden", { status: 403 });
  const file = Bun.file(`${CLIENT_DIR}${path}`);

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
        headers: { "Content-Type": "text/javascript; charset=utf-8" },
      });
    }

    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  }

  return new Response("Not found", { status: 404 });
}

// ── Auth middleware (simple: header x-user-id) ──
function getUserId(req: Request): number | null {
  const userId = req.headers.get("x-user-id");
  return userId ? parseInt(userId, 10) : null;
}

// ══════════════════════════════════════════════
//  MAIN SERVER
// ══════════════════════════════════════════════
const server = Bun.serve({
  port: 3000,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // CORS
    const corsHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-user-id",
    };

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── API routes ──
    if (path.startsWith("/api/")) {
      try {
        let response: Response;

        switch (true) {
          case path === "/api/auth/login" && method === "POST":
            response = await login(req);
            break;

          case path === "/api/balance" && method === "GET": {
            const uid = getUserId(req);
            if (!uid) return Response.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
            response = await getBalance(uid);
            break;
          }

          case path === "/api/withdraw" && method === "POST": {
            const uid = getUserId(req);
            if (!uid) return Response.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
            response = await createWithdrawalCode(uid, req);
            break;
          }

          case path === "/api/payments" && method === "POST": {
            const uid = getUserId(req);
            if (!uid) return Response.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
            response = await processPayment(uid, req);
            break;
          }

          case path === "/api/sos" && method === "POST": {
            const uid = getUserId(req);
            if (!uid) return Response.json({ error: "No autorizado" }, { status: 401, headers: corsHeaders });
            response = await triggerSOS(uid);
            break;
          }

          case path === "/api/schedule" && method === "GET":
            response = getSchedule();
            break;

          case path === "/api/health" && method === "GET":
            response = Response.json({ status: "ok", time: new Date().toISOString() });
            break;

          default:
            response = Response.json({ error: "Ruta no encontrada" }, { status: 404 });
        }

        // Inject CORS headers
        const body = await response.text();
        const headers = { ...corsHeaders, "Content-Type": "application/json" };
        return new Response(body, { status: response.status, headers });
      } catch (err) {
        return Response.json(
          { success: false, error: String(err) },
          { status: 500, headers: corsHeaders },
        );
      }
    }

    // ── Static files ──
    const staticPath = path === "/" ? "/index.html" : path;
    return serveStatic(staticPath);
  },
});

// ── Init ──
try {
  await initDB();
  await seedUser();
  console.log("[DB] Inicializada y usuario seed creado (DNI: 12345678, PIN: 0000)");
} catch (err) {
  console.warn("[DB] PostgreSQL no disponible, usando datos mock:", String(err));
}

console.log(`\nServidor BN-App corriendo en http://localhost:${server.port}`);
console.log(`  API:  http://localhost:${server.port}/api/`);
console.log(`  App:  http://localhost:${server.port}/\n`);
