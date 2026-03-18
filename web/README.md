Web demo (Vite + React)

Quick start:

```bash
cd web
npm install
VITE_API_URL=http://localhost:3000 npm run dev
```

By default the app will call relative endpoints; set `VITE_API_URL` to your API base URL if different.

Pages included:
- Products list and simple cart
- Checkout flow that POSTs to `/orders` and then `/orders/:id/pay` (stub)

Use `server/run_migrations.sh` and `server/run_seed.sh` to prepare the DB before testing.
