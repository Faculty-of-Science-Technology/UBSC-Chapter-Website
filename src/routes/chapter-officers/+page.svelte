<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import type { PageData } from './$types';

	export let data: PageData;
	const officers = data.officers;
</script>

<PublicNav />

<section class="w-full py-20">
	<div class="mx-auto max-w-7xl px-6">
		<!-- Heading -->
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				UB ACM Student Chapter Officers
			</h2>
			<p class="mx-auto max-w-3xl text-gray-600">
				The Chapter has an executive council, which includes elected chapter officers,
				the past Chairperson, and the chairpersons of the standing committees. The
				executive board manages the chapter’s affairs and welcomes feedback from members.
			</p>
		</div>

		<!-- Officers Grid -->
		<div class="grid justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
			{#each officers as officer}
				<Card.Root class="max-w-xs p-6 text-center hover:shadow-lg transition-shadow">
					<Card.Header>
						{#if officer.profilePicture}
							<img
								src={officer.profilePicture}
								alt="{officer.firstName} {officer.lastName}"
								class="mx-auto mb-4 h-28 w-28 rounded-full object-cover"
							/>
						{:else}
							<div class="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
								<span class="text-2xl font-bold text-primary">
									{officer.firstName[0]}{officer.lastName[0]}
								</span>
							</div>
						{/if}

						<Card.Title class="text-lg">
							{officer.firstName} {officer.lastName}
						</Card.Title>

						<Badge
							variant="secondary"
							class="mx-auto mt-2 bg-primary/30 text-secondary hover:bg-accent text-secondary"
						>
						
							{officer.role}
						</Badge>
					</Card.Header>

					{#if officer.bio}
						<Card.Content class="mt-4 rounded-md bg-primary/30 text-secondary hover:bg-accent text-secondary">
							{officer.bio}
						</Card.Content>
					{/if}
				</Card.Root>
			{/each}
		</div>
	</div>
</section>

<Footer />
