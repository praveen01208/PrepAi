import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const defaultUrl = Buffer.from(
  "cG9zdGdyZXNxbDovL25lb25kYl9vd25lcjpucGdfR2IwUVhvbGo0UFZFQGVwLWJsdWUtZmlyZWZseS1hNWQyem93ZC1wb29sZXIudXMtZWFzdC0yLmF3cy5uZW9uLnRlY2gvbmVvbmRiP3NzbG1vZGU9cmVxdWlyZQ==",
  "base64"
).toString("utf-8");

const dbUrl = process.env.DRIZZLE_DB_URL || defaultUrl;
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });


