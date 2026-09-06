import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const dbUrl = process.env.DRIZZLE_DB_URL || "postgresql://dummy:dummy@dummy.neon.tech/neondb?sslmode=require";
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });


