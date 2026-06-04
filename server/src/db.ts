import { Pool } from "pg";

const pool = new Pool({
  host: Bun.env.PG_HOST,
  port: Number(Bun.env.PG_PORT) || 5432,
  user: Bun.env.PG_USER,
  password: Bun.env.PG_PASSWORD,
  database: Bun.env.PG_DB,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
