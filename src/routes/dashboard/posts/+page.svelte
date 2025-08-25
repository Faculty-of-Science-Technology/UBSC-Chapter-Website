<script lang="ts">
	import { invalidateAll } from '$app/navigation';
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
				on:click={handleCreatePost}
				class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
										{formatDate(post.createdAt)}
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											on:click={() => togglePublished(post.id, post.published)}
											class="mr-4 text-indigo-600 hover:text-indigo-900"
											disabled={loading}
										>
											{post.published ? 'Unpublish' : 'Publish'}
										</button>
										<button
											on:click={() => handleEditPost(post)}
											class="mr-4 text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</button>
										<button
											on:click={() => deletePost(post.id)}
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
				on:click={() => (showCreatePost = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Blog Post</h3>
					<div class="mt-4 space-y-4">
						<div>
							<label for="title" class="block text-sm font-medium text-gray-700">Post Title</label>
							<input
								type="text"
								id="title"
								bind:value={newPost.title}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="slug" class="block text-sm font-medium text-gray-700">URL Slug</label>
							<input
								type="text"
								id="slug"
								bind:value={newPost.slug}
								placeholder="my-blog-post"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
							<p class="mt-1 text-sm text-gray-500">Used in the URL. Only letters, numbers, and dashes.</p>
						</div>

						<div>
							<label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
							<textarea
								id="excerpt"
								bind:value={newPost.excerpt}
								rows="2"
								placeholder="A brief description of the post..."
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							></textarea>
						</div>

						<div>
							<label for="content" class="block text-sm font-medium text-gray-700">Content</label>
							<textarea
								id="content"
								bind:value={newPost.content}
								rows="6"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							></textarea>
						</div>

						<div>
							<label for="type" class="block text-sm font-medium text-gray-700">Post Type</label>
							<select
								id="type"
								bind:value={newPost.type}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							>
								<option value="BLOG">Blog Post</option>
								<option value="EVENT">Event</option>
							</select>
						</div>

						<div>
							<label for="featuredImage" class="block text-sm font-medium text-gray-700">Featured Image URL</label>
							<input
								type="url"
								id="featuredImage"
								bind:value={newPost.featuredImage}
								placeholder="https://example.com/image.jpg"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="tags" class="block text-sm font-medium text-gray-700"
								>Tags (comma-separated)</label
							>
							<input
								type="text"
								id="tags"
								bind:value={newPost.tags}
								placeholder="web development, programming, tutorial"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="published"
								bind:checked={newPost.published}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label for="published" class="ml-2 block text-sm text-gray-700">
								Publish immediately
							</label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						on:click={submitCreatePost}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Post'}
					</button>
					<button
						type="button"
						on:click={() => (showCreatePost = false)}
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
				on:click={() => (showEditPost = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit Blog Post</h3>
					<div class="mt-4 space-y-4">
						<div>
							<label for="edit-title" class="block text-sm font-medium text-gray-700"
								>Post Title</label
							>
							<input
								type="text"
								id="edit-title"
								bind:value={editPost.title}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="edit-slug" class="block text-sm font-medium text-gray-700">URL Slug</label>
							<input
								type="text"
								id="edit-slug"
								bind:value={editPost.slug}
								placeholder="my-blog-post"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
							<p class="mt-1 text-sm text-gray-500">Used in the URL. Only letters, numbers, and dashes.</p>
						</div>

						<div>
							<label for="edit-excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
							<textarea
								id="edit-excerpt"
								bind:value={editPost.excerpt}
								rows="2"
								placeholder="A brief description of the post..."
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							></textarea>
						</div>

						<div>
							<label for="edit-content" class="block text-sm font-medium text-gray-700"
								>Content</label
							>
							<textarea
								id="edit-content"
								bind:value={editPost.content}
								rows="6"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							></textarea>
						</div>

						<div>
							<label for="edit-type" class="block text-sm font-medium text-gray-700">Post Type</label>
							<select
								id="edit-type"
								bind:value={editPost.type}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							>
								<option value="BLOG">Blog Post</option>
								<option value="EVENT">Event</option>
							</select>
						</div>

						<div>
							<label for="edit-featuredImage" class="block text-sm font-medium text-gray-700">Featured Image URL</label>
							<input
								type="url"
								id="edit-featuredImage"
								bind:value={editPost.featuredImage}
								placeholder="https://example.com/image.jpg"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div>
							<label for="edit-tags" class="block text-sm font-medium text-gray-700"
								>Tags (comma-separated)</label
							>
							<input
								type="text"
								id="edit-tags"
								bind:value={editPost.tags}
								placeholder="web development, programming, tutorial"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="edit-published"
								bind:checked={editPost.published}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label for="edit-published" class="ml-2 block text-sm text-gray-700">
								Published
							</label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						on:click={submitEditPost}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update Post'}
					</button>
					<button
						type="button"
						on:click={() => (showEditPost = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
