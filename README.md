# Taquería El Faraón - Sistema de pedidos

Sistema de pedidos en línea con panel de administración en tiempo real.

## Estructura

- `frontend/`: React + Vite (cliente y panel admin).
- `backend/`: Node.js + Express + MongoDB + Socket.io.

## Requisitos

- Node.js 18+
- MongoDB en ejecución

## Configuración rápida

1. Clona el repo y entra a la carpeta.
2. Copia variables de entorno:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Instala dependencias:

```bash
cd backend
npm install
cd ../frontend
npm install
```

4. Levanta el backend:

```bash
cd backend
npm run dev
```

5. Levanta el frontend:

```bash
cd frontend
npm run dev
```

## Endpoints

- `GET /api/menu`
- `POST /api/orders`
- `GET /api/orders` (protegido)
- `PATCH /api/orders/:id/status` (protegido)
- `POST /api/auth/login`

## Login administrador

Usa las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`. En el primer arranque se crea el usuario administrador automáticamente.

## Pruebas

```bash
cd backend
npm test
```

## Notas

- Descuento automático del 10% si el producto tiene `type: anafre`.
- Estados posibles del pedido: `pendiente`, `preparando`, `listo`.
