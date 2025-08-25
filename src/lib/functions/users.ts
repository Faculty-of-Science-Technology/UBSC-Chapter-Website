import { db } from '$lib/server/db';
import { Users } from '$lib/server/db/schema';
import { eq, type AnyColumn } from 'drizzle-orm';

export const checkUser = async (key: AnyColumn, value: string) => {
	const user = await db.select().from(Users).where(eq(key, value)).execute();
	return user;
};

export const getUser = async (key: AnyColumn, value: string) => {
	const user = db.query.Users.findFirst({
		where: eq(key, value)
	});
	return user;
};
