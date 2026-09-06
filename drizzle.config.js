import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DRIZZLE_DB_URL || 'postgresql://neondb_owner:npg_Gb0QXolj4PVE@ep-blue-firefly-a5d2zowd-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    }
};