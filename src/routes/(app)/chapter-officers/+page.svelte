<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as Card from '$lib/components/vendor/ui/card';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const officers = data.officers;
</script>

<section class="flex h-[300px] w-full items-center justify-center bg-muted md:px-32">
	<HeroBlock
		class="self-auto"
		no_signup
		text_light_blue="About"
		text="UB ACM Student Chapter Officers"
		subtitle="The Chapter has an executive council, which includes elected chapter officers,
				the past Chairperson, and the chairpersons of the standing committees. The
				executive board manages the chapter's affairs and welcomes feedback from members."
	/>
</section>
<section class="w-full py-20">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Heading -->

		<!-- Officers Grid -->
		<div class="grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
			{#each officers as officer}
				<Card.Root class="max-w-xs p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						{#if officer.profilePicture}
							<img
								src={officer.profilePicture}
								alt="{officer.firstName} {officer.lastName}"
								class="mx-auto mb-4 h-28 w-28 rounded-full object-cover"
							/>
						{:else if officer.firstName && officer.lastName}
							<div
								class="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10"
							>
								<span class="text-2xl font-bold text-primary">
									{officer.firstName[0]}{officer.lastName[0]}
								</span>
							</div>
						{:else}
							<div
								class="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10"
							>
								<span class="text-2xl font-bold text-primary">??</span>
							</div>
						{/if}

						<Card.Title class="text-lg">
							{officer.firstName}
							{officer.lastName}
						</Card.Title>

						<Badge
							variant="secondary"
							class="mx-auto mt-2 bg-primary/30 text-secondary text-secondary hover:bg-accent"
						>
							{officer.role}
						</Badge>
					</Card.Header>

					{#if officer.bio}
						<Card.Content
							class="mt-4 rounded-md bg-primary/30 text-secondary text-secondary hover:bg-accent"
						>
							{officer.bio}
						</Card.Content>
					{/if}
				</Card.Root>
			{/each}
		</div>
	</div>
</section>

<Footer />
