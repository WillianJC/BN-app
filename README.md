# InclusiApp — BN-app

Aplicación bancaria inclusiva diseñada para adultos mayores, con perfiles de accesibilidad visual y de lectura.

## Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | TypeScript vanilla + Vite 6 |
| **Backend** | NestJS 11 + TypeORM |
| **Base de datos** | PostgreSQL 17 (Neon.tech cloud) |
| **Autenticación** | JWT + Passport (cookie `token` + Bearer) |
| **Infraestructura** | Docker Compose (PostgreSQL + Server + Nginx) |

## Estructura

```
BN-app/
├── client/             → Frontend SPA (Vite + TS vanilla)
│   ├── src/
│   │   ├── main.ts     → App shell, routing, i18n, TTS, eventos
│   │   ├── api.ts      → Cliente HTTP para el backend
│   │   └── styles.css  → Estilos responsive + modo alto contraste
│   ├── index.html
│   └── vite.config.ts  → Proxy /auth y /finances → server
├── server/             → Backend API (NestJS)
│   ├── src/
│   │   ├── auth/       → Registro, login, JWT, guard
│   │   ├── finances/   → Wallet, transacciones, pagos, pensiones
│   │   └── logger/     → Logger custom con colores
│   └── Dockerfile
├── docs/api.md         → Documentación de endpoints
├── docker-compose.yml  → postgres + server + client
├── .env                → Variables de entorno
└── AGENTS.md           → Reglas del proyecto
```

## Perfiles de accesibilidad

- **Normal** — Texto estándar
- **Alta Visión** — Contraste amarillo/negro/cyan
- **Modo Guiado** — Interfaz basada en iconos, texto simplificado

Todas las pantallas incluyen síntesis de voz en español y botones de ayuda auditiva.

## Pantallas

| Pantalla | Descripción |
|----------|-------------|
| Auth | Login/registro con email + contraseña |
| Home | Dashboard con saldo y 4 cards de acción |
| Saldo | Detalle del saldo + cobrar pensión ($1,200) |
| QR/Retiro | Código de retiro + cobrar bono ($500) |
| Pagos | Pago de luz y agua |
| Ayuda | Llamada de asistencia |

## Cómo ejecutar

### Requisitos
- [Bun](https://bun.sh)
- Docker (opcional, para PostgreSQL local)

### 1. Base de datos

Opción A — PostgreSQL cloud (Neon.tech, ya configurado en `.env`):
```bash
# No requiere acción, el server se conecta automáticamente
```

Opción B — PostgreSQL local con Docker:
```bash
docker compose up -d postgres
```

### 2. Backend

```bash
cd server
bun install
bun run start:dev
```

### 3. Frontend

```bash
cd client
bun install
bun run dev
```

La app se abre en http://localhost:5173.

### Docker completo

```bash
docker compose up --build
```

## API

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | ❌ | Registrar usuario |
| POST | `/auth/login` | ❌ | Iniciar sesión |
| GET | `/auth/me` | ✅ | Perfil del usuario |
| GET | `/finances/wallet` | ✅ | Saldo actual |
| GET | `/finances/transactions` | ✅ | Historial paginado |
| POST | `/finances/transfer` | ✅ | Transferir dinero |
| POST | `/finances/withdraw` | ✅ | Retirar efectivo |
| POST | `/finances/pension` | ✅ | Cobrar pensión ($1,200) |
| POST | `/finances/bonus` | ✅ | Cobrar bono ($500) |
| POST | `/finances/pay-utility` | ✅ | Pagar recibo (luz/agua) |

Ver `docs/api.md` para detalles completos.

## Tipos de transacción

| Tipo | Descripción |
|------|-------------|
| `TRANSFER_IN` | Transferencia recibida |
| `TRANSFER_OUT` | Transferencia enviada |
| `WITHDRAWAL` | Retiro de efectivo |
| `PENSION` | Cobro de pensión |
| `BONUS` | Cobro de bono |
| `UTILITY_PAYMENT` | Pago de recibo |

## Scripts

```bash
bun run build:client   # Compila frontend
bun run build:server   # Compila backend
bun run build:all      # Compila ambos
```
