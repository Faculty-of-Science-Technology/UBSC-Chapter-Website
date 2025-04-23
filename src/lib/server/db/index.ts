import { DATABASE_URL, DATABASE_URL_UNPOOLED, IS_DEVELOPMENT } from '$env/static/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as drizzle_prod } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!DATABASE_URL_UNPOOLED) throw new Error('DATABASE_URL_UNPOOLED is not set');

const development = IS_DEVELOPMENT === 'true';

const connectionString = development ? DATABASE_URL : DATABASE_URL_UNPOOLED;

const db = (() => {
	if (development) {
		const client = neon(connectionString);
		return drizzle(client, { schema: { ...schema } });
	} else {
		return drizzle_prod(connectionString, { schema: { ...schema } });
	}
})();

export { db };

