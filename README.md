# InvoicePro

This project contains a small invoicing application with a **Node.js/Express** backend
and a **React/Vite** frontend written in TypeScript.

## Project structure

- `backend` – Express API serving authentication, client and invoice routes.
- `frontend` – React application consuming the API.

## Setup

1. Install dependencies in both folders:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Create a `.env` file inside `backend` with your database connection and JWT secret:
   ```env
   DB_HOST=localhost
   DB_USER=user
   DB_PASS=pass
   DB_NAME=invoicepro
   JWT_SECRET=your-secret
   ```

## Development

Run the backend and frontend in separate terminals:
```bash
# Backend
cd backend
npx ts-node src/server.ts

# Frontend
cd ../frontend
npm run dev
```

The frontend will be available on `http://localhost:5173` and the API on `http://localhost:5000`.
