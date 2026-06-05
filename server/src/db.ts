const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB, PG_SSLMODE, PG_CHANNELBINDING } = Bun.env;

const params = new URLSearchParams();
if (PG_SSLMODE) params.set("sslmode", PG_SSLMODE);
if (PG_CHANNELBINDING) params.set("channel_binding", PG_CHANNELBINDING);
const qs = params.toString();

const sql = new Bun.SQL(
  `postgres://${encodeURIComponent(PG_USER ?? "postgres")}:${encodeURIComponent(PG_PASSWORD ?? "")}@${PG_HOST || "localhost"}:${PG_PORT || "5432"}/${PG_DB || "postgres"}${qs ? `?${qs}` : ""}`,
);

export default sql;
