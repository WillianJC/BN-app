# API Endpoints

## Auth (`/auth`)

### `POST /auth/register`
Registra un nuevo usuario. Setea cookie `token`.

```json
{ "name": "Juan", "email": "juan@mail.com", "password": "123456" }
```

### `POST /auth/login`
Inicia sesión. Setea cookie `token`.

```json
{ "email": "juan@mail.com", "password": "123456" }
```

### `GET /auth/me`
Devuelve el payload del JWT del usuario autenticado (requiere cookie `token` o header `Authorization: Bearer <token>`).

---

## Finances (`/finances`)

Todos los endpoints requieren autenticación (cookie `token` o `Authorization: Bearer`).

### `GET /finances/wallet`
Obtiene el saldo actual del usuario.

```json
{ "id": "uuid", "balance": 1500.00 }
```

### `GET /finances/transactions`
Historial de transacciones paginado.

| Query | Default | Descripción |
|-------|---------|-------------|
| `page` | 1 | Número de página |
| `limit` | 20 | Items por página |

### `POST /finances/transfer`
Transfiere dinero a otro usuario.

```json
{ "recipientId": "uuid", "amount": 100.00, "description": "Pago de servicio" }
```

### `POST /finances/withdraw`
Simula retiro de efectivo.

```json
{ "amount": 50.00 }
```

### `POST /finances/pension`
Cobra pensión (S/ 1200 fijo). Sin body.

### `POST /finances/bonus`
Cobra bono (S/ 500 fijo). Sin body.

### `POST /finances/pay-utility`
Paga recibo de luz o agua.

```json
{ "utilityType": "ELECTRICITY", "amount": 85.50, "invoiceNumber": "F001-12345" }
```

`utilityType`: `ELECTRICITY` | `WATER`

---

## Tipos de transacción

| Tipo | Descripción |
|------|-------------|
| `TRANSFER_IN` | Transferencia recibida |
| `TRANSFER_OUT` | Transferencia enviada |
| `WITHDRAWAL` | Retiro de efectivo |
| `PENSION` | Cobro de pensión |
| `BONUS` | Cobro de bono |
| `UTILITY_PAYMENT` | Pago de recibo (luz/agua) |
