import "server-only";

import { Pool, type PoolConfig, type QueryResultRow } from "pg";

const DEFAULT_SCHEMA = "dev_activity_hub";

type GlobalPool = typeof globalThis & {
  __devActivityDashboardPool?: Pool;
};

function resolveSchema() {
  const schema = process.env.APP_DB_SCHEMA ?? DEFAULT_SCHEMA;
  if (!/^[a-zA-Z0-9_]+$/.test(schema)) {
    throw new Error(`Invalid schema name: ${schema}`);
  }
  return schema;
}

function buildPoolConfig(): PoolConfig | null {
  if (process.env.DATABASE_URL) {
    const connectionString = normalizeConnectionString(process.env.DATABASE_URL);
    return {
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30_000,
    };
  }

  const host = process.env.SUPABASE_DB_HOST;
  const database = process.env.SUPABASE_DB_NAME;
  const user = process.env.SUPABASE_DB_USERNAME;
  const password = process.env.SUPABASE_DB_PASSWORD;

  if (!host || !database || !user || !password) {
    return null;
  }

  return {
    host,
    port: Number(process.env.SUPABASE_DB_PORT ?? 5432),
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  };
}

function normalizeConnectionString(connectionString: string) {
  const url = new URL(connectionString);

  // Supabase pooler examples often include sslmode=require. For pg in Node,
  // we already pass an explicit ssl option, so stripping it avoids stricter
  // certificate validation semantics from the connection string parser.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");

  return url.toString();
}

function getPool() {
  const globalPool = globalThis as GlobalPool;
  if (globalPool.__devActivityDashboardPool) {
    return globalPool.__devActivityDashboardPool;
  }

  const config = buildPoolConfig();
  if (!config) {
    return null;
  }

  const pool = new Pool(config);
  globalPool.__devActivityDashboardPool = pool;
  return pool;
}

export const dbSchema = resolveSchema();

export async function query<T extends QueryResultRow>(
  sql: string,
  params: readonly unknown[] = [],
) {
  const pool = getPool();
  if (!pool) {
    throw new Error("Database connection is not configured.");
  }

  return pool.query<T>(sql, [...params]);
}
