import { db } from '$lib/server/db';
import { and, eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Fetch published BLOG posts only
	const posts = await db.query.Posts.findMany({
		where: (posts) =>
			and(
				eq(posts.Type, 'BLOG'), 
				eq(posts.Published, true)
			),
		orderBy: (posts) => [desc(posts.CreatedAt)]
	});

	return {
		posts: posts.map((post) => ({
			title: post.Title,
			date: post.PublishedAt ?? post.CreatedAt,
			excerpt:
				post.Excerpt ??
				(post.Content ?? '').slice(0, 150) + '...'
		}))
	};
};
