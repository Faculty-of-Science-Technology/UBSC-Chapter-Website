<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Dialog from '$lib/components/vendor/ui/dialog';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { posts } = data;

	let selectedPost: any = null;
	let showDialog = false;

	function openPost(post: any) {
		selectedPost = post;
		showDialog = true;
	}

	function closePost() {
		showDialog = false;
		selectedPost = null;
	}
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>

<page class="inline-flex h-full w-full flex-col items-center gap-32 mt-24">
	<main class="mx-2 flex flex-col items-center gap-8 self-stretch lg:mx-20 xl:mx-32">
		<!-- Hero -->
		<section class="w-full">
			<HeroBlock
				no_signup
				text_light_blue="Chapter"
				text="Posts"
				subtitle="Announcements, updates, and articles from our student chapter."
			/>
		</section>

		<!-- Posts -->
		<section class="w-full flex justify-center">
			<div class="w-full max-w-7xl px-6">
				<div class="mb-12 text-center">
					<h2 class="text-3xl font-bold">Latest Posts</h2>
				</div>

				{#if posts.length === 0}
					<p class="text-center text-secondary/70">
						No posts available yet.
					</p>
				{:else}
					<div class="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
						{#each posts as post}
							<Card.Root
								class="p-6 transition-transform hover:scale-105 cursor-pointer"
								onclick={() => openPost(post)}
							>
								<Card.Header>
									<Card.Title class="text-xl font-bold">
										{post.title}
									</Card.Title>
									<p class="text-sm text-secondary/70">
										{new Date(post.date).toLocaleDateString()}
									</p>
								</Card.Header>

								<Card.Content>
									<p class="text-sm text-secondary/80">
										{post.excerpt}
									</p>
								</Card.Content>

								<Card.Footer class="flex gap-2">
									<Badge variant="outline">Blog</Badge>
								</Card.Footer>
							</Card.Root>
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</main>

	<Footer />
</page>

<!-- POST VIEW DIALOG -->
{#if selectedPost}
	<Dialog.Root open={showDialog} onOpenChange={closePost}>
		<Dialog.Content class="max-w-2xl">
			<Dialog.Header>
				<Dialog.Title class="text-xl font-bold">
					{selectedPost.title}
				</Dialog.Title>
				<p class="text-sm text-secondary/70">
					{new Date(selectedPost.date).toLocaleDateString()}
				</p>
			</Dialog.Header>

			<div class="mt-4 max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm">
				{selectedPost.content}
			</div>

			<div class="mt-6 flex justify-end">
				<button
					class="px-4 py-2 rounded bg-primary text-background"
					onclick={closePost}
				>
					Close
				</button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
```
