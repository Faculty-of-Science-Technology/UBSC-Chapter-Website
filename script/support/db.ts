import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../../src/lib/server/db/schema.ts';

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = neon(process.env.DATABASE_URL);

export const db = drizzle(client, {
	schema: {
		...schema
	}
});