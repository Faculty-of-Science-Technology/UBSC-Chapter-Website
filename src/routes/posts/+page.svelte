<script lang="ts">
	import type { PageData } from './$types';
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as Card from '$lib/components/vendor/ui/card';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';

	export let data: PageData;
	const { posts } = data;
</script>

<svelte:head>
	<title>Posts</title>
</svelte:head>

<page class="inline-flex h-full w-full flex-col items-center gap-32">
	<PublicNav />

	<main class="mx-2 flex flex-col items-center gap-8 self-stretch lg:mx-20 xl:mx-60">
		<!-- Hero -->
		<section class="w-full ml-4">
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
							<Card.Root class="p-6 transition-transform hover:scale-105">
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
