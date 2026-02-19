import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const isExternal = process.env.DATABASE_URL?.includes("neon.tech") ||
  process.env.DATABASE_URL?.includes("supabase") ||
  process.env.VERCEL === "1";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isExternal ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
