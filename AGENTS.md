# Project Rules

## Security
- Never commit secrets, env files, or credentials
- Never log env vars, tokens, or passwords
- Use `.env` locally; pass envs via Docker Compose `environment:` or `env_file:` for containers
- Keep `.env.example` with dummy values, never real secrets
- Validate and sanitize all user input in endpoints
- Use parameterized queries (never string interpolation in SQL)

## Bun-native over external libs
- Use `Bun.serve()` instead of `express`, `fastify`, etc.
- Use `Bun.sql` for PostgreSQL queries over `pg`, `postgres.js`
- Use `Bun.write`, `Bun.file` over `fs` read/write
- Use `Bun.password` for hashing over `bcrypt`, `argon2`
- Use `Bun.build` instead of `webpack`, `esbuild`, `rollup`
- Use `Bun.test` instead of `jest`, `vitest`
- Use `WebSocket` (built-in) instead of `ws`
- Only reach for external libs when Bun has no built-in equivalent

## Code style
- TypeScript strict mode
- No `any` unless strictly necessary
- Prefer `async/await` over callbacks
- ESM modules only (`import`/`export`)
