Order API test helper

Usage:

1. Ensure the server is running and the database has been migrated and seeded.

2. Run the test script (optional env vars):

```bash
API_URL=http://localhost:3000 USER_ID=<uuid> SESSION_ID=<uuid> ./server/test/test_order.sh
```

The script will POST to `/orders`, print the create response, then POST `/orders/:id/pay` to mark paid.

Notes:
- This is a smoke test for local development. It assumes products `sku1`,`sku2`,`sku3` exist (see `server/seeds/seed_products.sql`).
- Adjust `API_URL` if your server runs on a different port.
