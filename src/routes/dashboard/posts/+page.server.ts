import { db } from '$lib/server/db';
import { Groups, Posts, PostTags, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc, eq, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    try {
        // Fetch all blog posts (posts with type 'BLOG')
        const blogPosts = await db
            .select({
                id: Posts.Id,
                title: Posts.Title,
                content: Posts.Content,
                type: Posts.Type,
                published: Posts.Published,
                createdAt: Posts.CreatedAt,
                updatedAt: Posts.UpdatedAt,
                authorId: Posts.AuthorId,
                featuredImage: Posts.FeaturedImage,
                excerpt: Posts.Excerpt,
                slug: Posts.Slug,
                publishedAt: Posts.PublishedAt,
                authorFirstName: Users.FirstName,
                authorLastName: Users.LastName
            })
            .from(Posts)
            .leftJoin(Users, eq(Posts.AuthorId, Users.Id))
            .where(eq(Posts.Type, 'BLOG'))
            .orderBy(desc(Posts.CreatedAt));

        // Get tags for each post
        const postIds = blogPosts.map(post => post.id);
        const tagsData = postIds.length > 0 
            ? await db
                .select({
                    postId: PostTags.PostId,
                    tag: PostTags.TagName
                })
                .from(PostTags)
                .where(inArray(PostTags.PostId, postIds))
            : [];

        // Create a map of tags by post ID
        const tagsMap = new Map();
        tagsData.forEach(({ postId, tag }) => {
            if (!tagsMap.has(postId)) {
                tagsMap.set(postId, []);
            }
            tagsMap.get(postId).push(tag);
        });

        // Add tags to blog posts
        const postsWithTags = blogPosts.map(post => ({
            ...post,
            authorName: post.authorFirstName,
            authorLastName: post.authorLastName,
            tags: tagsMap.get(post.id) || []
        }));

        // Fetch all groups for the create/edit form
        const availableGroups = await db
            .select({
                id: Groups.Id,
                name: Groups.Title,
                type: Groups.Type
            })
            .from(Groups)
            .where(eq(Groups.IsActive, true))
            .orderBy(Groups.Title);

        return {
            posts: postsWithTags,
            availableGroups
        };
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return {
            posts: [],
            availableGroups: []
        };
    }
};
