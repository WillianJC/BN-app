# Project Rules

## Security
- Never commit secrets, env files, or credentials
- Never log env vars, tokens, or passwords
- Use `.env` locally; pass envs via Docker Compose `environment:` or `env_file:` for containers
- Keep `.env.example` with dummy values, never real secrets
- Validate and sanitize all user input in endpoints
- Use parameterized queries (never string interpolation in SQL)

## NestJS over raw Bun
- Use NestJS modules, guards, pipes, interceptors, filters over manual middleware
- Use `@nestjs/typeorm` + `TypeOrmModule` instead of `Bun.sql`
- Use `@nestjs/config` + `ConfigService` for env management
- Use `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt` for auth over manual JWT
- Use `@nestjs/common` Logger or custom ConsoleLogger instead of raw console
- Use NestJS `APP_*` providers (guard, filter, pipe) for global setup
- Use `cookie-parser` via `app.use()` for cookies
- Prefer TypeORM or NestJS-native patterns over Bun built-ins (Bun.serve, Bun.write, etc.)

## Code style
- TypeScript strict mode
- No `any` unless strictly necessary
- Prefer `async/await` over callbacks
- ESM modules only (`import`/`export`)
