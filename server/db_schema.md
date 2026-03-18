Postgres schema for AI 奶茶研究所 (MVP)

Overview
- Simple normalized schema to support users, products, orders, sessions (kiosk state), relations (duo), and prompt logs.
- Use UUID primary keys, timestamps, and indexes on commonly queried fields.

Tables

1. users

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  openid VARCHAR(128) UNIQUE, -- WeChat openid
  display_name VARCHAR(128),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

Indexes: users(openid)

2. taste_profiles

CREATE TABLE taste_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tags TEXT[], -- e.g. ['fruity','less_sugar']
  updated_at TIMESTAMPTZ DEFAULT now()
);

Indexes: taste_profiles(user_id)

3. products

CREATE TABLE products (
  id TEXT PRIMARY KEY, -- keep consistent with sku ids from POS
  name TEXT,
  price_cents INT,
  tags TEXT[],
  available BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

4. orders

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_cents INT,
  items JSONB, -- [{id, name, qty, price_cents}]
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

Indexes: orders(user_id, created_at)

5. relations

CREATE TABLE relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES users(id),
  user_b UUID REFERENCES users(id),
  relation_type TEXT, -- 'friend'|'couple'|'flirty'
  created_at TIMESTAMPTZ DEFAULT now()
);

6. sessions (kiosk local session)

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key VARCHAR(64) UNIQUE, -- e.g., QR token
  users UUID[], -- users currently connected (1 or 2)
  relation TEXT DEFAULT 'single',
  scene TEXT,
  state JSONB, -- state machine snapshot
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

7. prompt_logs

CREATE TABLE prompt_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES sessions(id),
  prompt_name TEXT,
  user_payload JSONB,
  llm_response JSONB,
  valid BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);

Notes
- Keep product canonical data in `products` but recommendations logic should be handled in application layer.
- Use JSONB for flexible fields (items, state, metadata) but maintain clear mapping in application code.
- Add monitoring: counts for prompt_logs (invalid responses) to detect model regressions.

Migration hints
- Use `pgcrypto` or `uuid-ossp` for UUID generation; prefer `gen_random_uuid()` from `pgcrypto`.
