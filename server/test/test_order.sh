#!/usr/bin/env bash
set -euo pipefail

# Simple smoke test for orders endpoints.
# Requires: API_URL (default http://localhost:3000) and optional USER_ID and SESSION_ID

API_URL=${API_URL:-http://localhost:3000}
USER_ID=${USER_ID:-}
SESSION_ID=${SESSION_ID:-}

echo "Using API at $API_URL"

cat <<'CURL' > /tmp/order_payload.json
{
  "userId": "${USER_ID}",
  "sessionId": "${SESSION_ID}",
  "items": [
    { "id": "sku2", "quantity": 1 },
    { "id": "sku1", "quantity": 2 }
  ]
}
CURL

echo "Creating order..."
CREATE_RESP=$(curl -sS -X POST "$API_URL/orders" -H "Content-Type: application/json" -d @/tmp/order_payload.json)
echo "Create response: $CREATE_RESP"

ORDER_ID=$(echo "$CREATE_RESP" | sed -n 's/.*"order_id"[[:space:]]*:[[:space:]]*"\([^"]\+\)".*/\1/p')
TOTAL=$(echo "$CREATE_RESP" | sed -n 's/.*"total_cents"[[:space:]]*:[[:space:]]*\([0-9]\+\).*/\1/p')

if [ -z "$ORDER_ID" ]; then
  echo "Failed to create order; raw response:" >&2
  echo "$CREATE_RESP" >&2
  exit 2
fi

echo "Order created: $ORDER_ID (total_cents=$TOTAL)"

echo "Marking order paid..."
PAY_RESP=$(curl -sS -X POST "$API_URL/orders/$ORDER_ID/pay" -H "Content-Type: application/json")
echo "Pay response: $PAY_RESP"

PAID=$(echo "$PAY_RESP" | grep -o '"paid"[[:space:]]*:[[:space:]]*true' || true)
if [ -z "$PAID" ]; then
  echo "Payment stub failed or returned unpaid. Response:" >&2
  echo "$PAY_RESP" >&2
  exit 3
fi

echo "Order $ORDER_ID marked paid successfully."
