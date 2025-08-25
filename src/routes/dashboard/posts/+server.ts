import { db } from '$lib/server/db';
import { Posts, PostTags } from '$lib/server/db/schema';
import { error, isHttpError, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	try {
		const body = await request.json();
		const { action } = body;

		switch (action) {
			case 'create': {
				const { title, content, slug, excerpt, type, featuredImage, published, tags } = body;

				if (!title || !content || !slug || !type) {
					throw error(400, 'Title, content, slug, and type are required');
				}

				// Insert the post
				const [post] = await db
					.insert(Posts)
					.values({
						Title: title,
						Slug: slug,
						Content: content,
						Excerpt: excerpt,
						Type: type,
						AuthorId: locals.user.Id,
						FeaturedImage: featuredImage,
						Published: published || false,
						PublishedAt: published ? new Date() : null,
						CreatedAt: new Date(),
						UpdatedAt: new Date()
					})
					.returning();

				// Handle tags
				if (tags && tags.trim()) {
					const tagList = tags
						.split(',')
						.map((tag: string) => tag.trim())
						.filter((tag: string) => tag);
					if (tagList.length > 0) {
						await db.insert(PostTags).values(
							tagList.map((tag: string) => ({
								PostId: post.Id,
								TagName: tag
							}))
						);
					}
				}

				return json({ success: true });
			}

			case 'update': {
				const { id, title, content, slug, excerpt, type, featuredImage, published, tags } = body;

				if (!id || !title || !content || !slug || !type) {
					throw error(400, 'ID, title, content, slug, and type are required');
				}

				// Update the post
				await db
					.update(Posts)
					.set({
						Title: title,
						Slug: slug,
						Content: content,
						Excerpt: excerpt,
						Type: type,
						FeaturedImage: featuredImage,
						Published: published || false,
						PublishedAt: published ? new Date() : null,
						UpdatedAt: new Date()
					})
					.where(eq(Posts.Id, id));

				// Update tags
				await db.delete(PostTags).where(eq(PostTags.PostId, id));

				if (tags && tags.trim()) {
					const tagList = tags
						.split(',')
						.map((tag: string) => tag.trim())
						.filter((tag: string) => tag);
					if (tagList.length > 0) {
						await db.insert(PostTags).values(
							tagList.map((tag: string) => ({
								PostId: id,
								TagName: tag
							}))
						);
					}
				}

				return json({ success: true });
			}

			case 'delete': {
				const { postId } = body;

				if (!postId) {
					throw error(400, 'Post ID is required');
				}

				// Delete tags first
				await db.delete(PostTags).where(eq(PostTags.PostId, postId));

				// Delete the post
				await db.delete(Posts).where(eq(Posts.Id, postId));

				return json({ success: true });
			}

			case 'toggle-published': {
				const { postId, published } = body;

				if (!postId || typeof published !== 'boolean') {
					throw error(400, 'Post ID and published status are required');
				}

				await db
					.update(Posts)
					.set({
						Published: published,
						PublishedAt: published ? new Date() : null,
						UpdatedAt: new Date()
					})
					.where(eq(Posts.Id, postId));

				return json({ success: true });
			}

			default:
				throw error(400, 'Invalid action');
		}
	} catch (err) {
        if (isHttpError(err)) throw err;
		console.error('Posts API error:', err);
		throw error(500, 'Internal server error');
	}
};
