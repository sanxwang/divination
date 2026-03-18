import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || '';
if (!connectionString) {
  console.warn('No DATABASE_URL / PG_CONNECTION set; DB calls will fail until set.');
}

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function getClient() {
  return pool.connect();
}
