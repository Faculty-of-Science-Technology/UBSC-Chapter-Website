<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreatePost = $state(false);
	let showEditPost = $state(false);
	let selectedPost: any = $state(null);
	let loading = $state(false);

	// Form data for creating new post
	let newPost = $state({
		title: '',
		content: '',
		slug: '',
		excerpt: '',
		type: 'BLOG',
		featuredImage: '',
		published: false,
		tags: '' // Comma-separated tags
	});

	// Edit post data
	let editPost = $state({
		id: '',
		title: '',
		content: '',
		slug: '',
		excerpt: '',
		type: 'BLOG',
		featuredImage: '',
		published: false,
		tags: '' // Comma-separated tags
	});

	// Helper function to generate URL slug from title
	function generateSlug(title: string) {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');
	}

	// Auto-generate slug when title changes
	$effect(() => {
		if (newPost.title && !newPost.slug) {
			newPost.slug = generateSlug(newPost.title);
		}
	});

	function handleCreatePost() {
		showCreatePost = true;
		newPost = {
			title: '',
			content: '',
			slug: '',
			excerpt: '',
			type: 'BLOG',
			featuredImage: '',
			published: false,
			tags: ''
		};
	}

	function handleEditPost(post: any) {
		selectedPost = post;
		editPost = {
			id: post.id,
			title: post.title,
			content: post.content,
			slug: post.slug || '',
			excerpt: post.excerpt || '',
			type: post.type || 'BLOG',
			featuredImage: post.featuredImage || '',
			published: post.published,
			tags: post.tags.join(', ')
		};
		showEditPost = true;
	}

	async function submitCreatePost() {
		loading = true;
		try {
			const response = await fetch('/dashboard/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'create', ...newPost })
			});

			if (response.ok) {
				showCreatePost = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating post: ' + error);
			}
		} catch (error) {
			alert('Error creating post: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitEditPost() {
		loading = true;
		try {
			const response = await fetch('/dashboard/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'update', ...editPost })
			});

			if (response.ok) {
				showEditPost = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating post: ' + error);
			}
		} catch (error) {
			alert('Error updating post: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deletePost(postId: string) {
		if (!confirm('Are you sure you want to delete this post? This action cannot be undone.'))
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', postId })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting post: ' + error);
			}
		} catch (error) {
			alert('Error deleting post: ' + error);
		} finally {
			loading = false;
		}
	}

	async function togglePublished(postId: string, published: boolean) {
		loading = true;
		try {
			const response = await fetch('/dashboard/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'toggle-published', postId, published: !published })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating post: ' + error);
			}
		} catch (error) {
			alert('Error updating post: ' + error);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function truncateContent(content: string, maxLength: number = 100) {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	}
</script>

<svelte:head>
	<title>Blog Posts - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Blog Posts</h1>
			<p class="mt-2 text-sm text-gray-700">
				Manage chapter blog posts, announcements, and articles.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreatePost}
				class="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
			>
				Create Post
			</button>
		</div>
	</div>

	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
								>
									Post
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Author & Group
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Tags
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Status
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Created
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.posts as post}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div class="ml-4">
												<div class="font-medium text-gray-900">
													{post.title}
													{#if post.featured}
														<span
															class="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
														>
															Featured
														</span>
													{/if}
												</div>
												<div class="text-gray-500">
													{truncateContent(post.content)}
												</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div>
											<div class="font-medium text-gray-900">
												{post.authorName}
												{post.authorLastName}
											</div>
											<div class="text-gray-500">
												{post.groupName || 'No Group'}
											</div>
										</div>
									</td>
									<td class="px-3 py-4 text-sm text-gray-500">
										<div class="flex flex-wrap gap-1">
											{#each post.tags as tag}
												<span
													class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
												>
													{tag}
												</span>
											{/each}
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{#if post.published}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
											>
												Published
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
											>
												Draft
											</span>
										{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{formatDate(post.createdAt.toJSON())}
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											onclick={() => togglePublished(post.id, post.published)}
											class="mr-4 text-sky-600 hover:text-sky-900"
											disabled={loading}
										>
											{post.published ? 'Unpublish' : 'Publish'}
										</button>
										<button
											onclick={() => handleEditPost(post)}
											class="mr-4 text-sky-600 hover:text-sky-900"
										>
											Edit
										</button>
										<button
											onclick={() => deletePost(post.id)}
											class="text-red-600 hover:text-red-900"
											disabled={loading}
										>
											Delete
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Create Post Modal -->
{#if showCreatePost}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreatePost = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Blog Post</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="title">Post Title</Label>
							<Input
								type="text"
								id="title"
								bind:value={newPost.title}
								required
							/>
						</div>

						<div>
							<Label for="slug">URL Slug</Label>
							<Input
								type="text"
								id="slug"
								bind:value={newPost.slug}
								placeholder="my-blog-post"
								required
							/>
							<p class="mt-1 text-sm text-gray-500">Used in the URL. Only letters, numbers, and dashes.</p>
						</div>

						<div>
							<Label for="excerpt">Excerpt</Label>
							<Textarea
								id="excerpt"
								bind:value={newPost.excerpt}
								rows={2}
								placeholder="A brief description of the post..."
							/>
						</div>

						<div>
							<Label for="content">Content</Label>
							<Textarea
								id="content"
								bind:value={newPost.content}
								rows={6}
								required
							/>
						</div>

						<div>
							<Label for="type">Post Type</Label>
							<Select.Root type="single" bind:value={newPost.type}>
								<Select.Trigger class="w-full">
									<!--- String hacking for title-case -->
									{(newPost.type? newPost.type[0] + newPost.type.toLocaleLowerCase().slice(1, 99) : "Select post type")}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="BLOG">Blog Post</Select.Item>
									<Select.Item value="EVENT">Event</Select.Item>
								</Select.Content>
							</Select.Root>
							<p class="mt-1 text-sm text-gray-500">Once converted, you cannot change the post type.</p>
						</div>

						<div>
							<Label for="featuredImage">Featured Image URL</Label>
							<Input
								type="url"
								id="featuredImage"
								bind:value={newPost.featuredImage}
								placeholder="https://example.com/image.jpg"
							/>
						</div>

						<div>
							<Label for="tags">Tags (comma-separated)</Label>
							<Input
								type="text"
								id="tags"
								bind:value={newPost.tags}
								placeholder="web development, programming, tutorial"
							/>
						</div>

						<div class="flex items-center space-x-2">
							<Switch id="published" bind:checked={newPost.published} />
							<Label for="published">
								Publish immediately
							</Label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreatePost}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Post'}
					</button>
					<button
						type="button"
						onclick={() => (showCreatePost = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Post Modal -->
{#if showEditPost}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showEditPost = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit Blog Post</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="edit-title">Post Title</Label>
							<Input
								type="text"
								id="edit-title"
								bind:value={editPost.title}
								required
							/>
						</div>

						<div>
							<Label for="edit-slug">URL Slug</Label>
							<Input
								type="text"
								id="edit-slug"
								bind:value={editPost.slug}
								placeholder="my-blog-post"
								required
							/>
							<p class="mt-1 text-sm text-gray-500">Used in the URL. Only letters, numbers, and dashes.</p>
						</div>

						<div>
							<Label for="edit-excerpt">Excerpt</Label>
							<Textarea
								id="edit-excerpt"
								bind:value={editPost.excerpt}
								rows={2}
								placeholder="A brief description of the post..."
							/>
						</div>

						<div>
							<Label for="edit-content">Content</Label>
							<Textarea
								id="edit-content"
								bind:value={editPost.content}
								rows={6}
								required
							/>
						</div>

						<div>
							<Label for="edit-type">Post Type</Label>
							<Select.Root type="single" bind:value={editPost.type}>
								<Select.Trigger class="w-full">
									<!-- String-hacking for title-case -->
									{(editPost.type ? editPost.type[0] + editPost.type.toLocaleLowerCase().slice(1, 99) : "Select post type")}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="BLOG">Blog Post</Select.Item>
									<Select.Item value="EVENT">Event</Select.Item>
								</Select.Content>
							</Select.Root>
							<p class="mt-1 text-sm text-gray-500">Once converted, you cannot change the post type.</p>
						</div>

						<div>
							<Label for="edit-featuredImage">Featured Image URL</Label>
							<Input
								type="url"
								id="edit-featuredImage"
								bind:value={editPost.featuredImage}
								placeholder="https://example.com/image.jpg"
							/>
						</div>

						<div>
							<Label for="edit-tags">Tags (comma-separated)</Label>
							<Input
								type="text"
								id="edit-tags"
								bind:value={editPost.tags}
								placeholder="web development, programming, tutorial"
							/>
						</div>

						<div class="flex items-center space-x-2">
							<Switch id="edit-published" bind:checked={editPost.published} />
							<Label for="edit-published">
								Published
							</Label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitEditPost}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update Post'}
					</button>
					<button
						type="button"
						onclick={() => (showEditPost = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
