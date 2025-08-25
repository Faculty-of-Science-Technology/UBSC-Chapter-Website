import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Determine which adapter to use based on DEVELOPMENT env variable
const isDevelopment = process.env.IS_DEVELOPMENT === 'true';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!process.env.DATABASE_URL_PROD) throw new Error('DATABASE_URL_PROD is not set');

const dbCredentialUrl = isDevelopment
	? process.env.DATABASE_URL
	: process.env.DATABASE_URL_PROD;

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: dbCredentialUrl
	},

	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
