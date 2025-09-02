<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import { AspectRatio } from '$lib/components/vendor/ui/aspect-ratio';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Dialog from '$lib/components/vendor/ui/dialog';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State for dialog
	let selectedGroup: any = $state(null);

	// Filter groups by type
	const standardGroups = data.groups.filter((group) => group.Type === 'STANDARD' && group.IsActive);
	const committees = data.groups.filter((group) => group.Type === 'COMMITTEE' && group.IsActive);
</script>

<svelte:head>
	<title>Groups & Commitees - UBSC Chapter</title>
	<meta
		name="description"
		content="Explore the various Special Interest Groups (SIGs) and committees of the University of Belize ACM Chapter."
	/>
</svelte:head>

<page class="inline-flex h-full w-full flex-col items-center gap-32">
	<PublicNav />
	<main class="mx-2 flex flex-col items-center gap-8 self-stretch lg:mx-20 xl:mx-60">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				no_signup
				text_light_blue="Chapter"
				text="Special Interest Groups & Commitees"
				subtitle="Here are the groups and commitees that you can take part in at the UB ACM Student Chapter. Whatever interest you may have, there is a group with like minded inviduals that you can network with! Find your field(s) of interest and develop your skills beyond the classroom!"
			/>
		</section>

		<!-- Statistics Section -->
		<section class="w-full">
			<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-blue-600"
							>{data.statistics.totalGroups}</Card.Title
						>
						<p class="text-sm text-gray-600">Total Groups</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-green-600"
							>{data.statistics.activeGroups}</Card.Title
						>
						<p class="text-sm text-gray-600">Active Groups</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-sky-600"
							>{data.statistics.totalMembers}</Card.Title
						>
						<p class="text-sm text-gray-600">Total Members</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-orange-600">{committees.length}</Card.Title>
						<p class="text-sm text-gray-600">Committees</p>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Special Interest Groups Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Special Interest Groups</h2>
				<p class="mx-auto max-w-2xl text-gray-600">
					Join a community of like-minded individuals passionate about specific areas of technology
				</p>
			</div>

			{#if standardGroups.length > 0}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each standardGroups as group}
						<Card.Root
							class="cursor-pointer transition-shadow hover:shadow-lg"
							onclick={() => (selectedGroup = group)}
						>
							<div class="p-1">
								<AspectRatio
									ratio={16 / 9}
									class="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-sky-600"
								>
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="mb-1 text-lg font-bold">{group.Title}</h3>
										<p class="line-clamp-2 text-sm opacity-90">
											{group.Description || 'A Special Interest Group for ACM members'}
										</p>
										<div class="mt-2 flex items-center gap-2">
											<Badge variant="secondary" class="border-white/20 bg-white/20 text-white">
												SIG
											</Badge>
											<span class="text-xs">
												{group.members.filter((m: any) => m.user).length} member{group.members.filter(
													(m: any) => m.user
												).length !== 1
													? 's'
													: ''}
											</span>
										</div>
									</div>
								</AspectRatio>
							</div>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<Card.Root class="p-12 text-center">
					<Card.Content>
						<p class="text-lg text-gray-600">No active Special Interest Groups at the moment.</p>
						<p class="mt-2 text-sm text-gray-500">Check back later for new groups!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- Committees Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Committees</h2>
				<p class="mx-auto max-w-2xl text-gray-600">
					Our committees work behind the scenes to organize events, manage operations, and drive
					strategic initiatives
				</p>
			</div>

			{#if committees.length > 0}
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each committees as committee}
						<Card.Root
							class="cursor-pointer transition-shadow hover:shadow-lg"
							onclick={() => (selectedGroup = committee)}
						>
							<div class="p-1">
								<AspectRatio
									ratio={16 / 9}
									class="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-500 to-blue-600"
								>
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="mb-1 text-lg font-bold">{committee.Title}</h3>
										<p class="line-clamp-2 text-sm opacity-90">
											{committee.Description || 'A committee dedicated to chapter operations'}
										</p>
										<div class="mt-2 flex items-center gap-2">
											<Badge variant="secondary" class="border-white/20 bg-white/20 text-white">
												Committee
											</Badge>
											<span class="text-xs">
												{committee.members.filter((m: any) => m.user).length} member{committee.members.filter(
													(m: any) => m.user
												).length !== 1
													? 's'
													: ''}
											</span>
										</div>
									</div>
								</AspectRatio>
							</div>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<Card.Root class="p-12 text-center">
					<Card.Content>
						<p class="text-lg text-gray-600">No active committees at the moment.</p>
						<p class="mt-2 text-sm text-gray-500">Check back later for committee information!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- How to Join Section -->
		<section class="w-full">
			<Card.Root class="bg-gradient-to-r from-blue-50 to-sky-50 p-12">
				<Card.Header class="text-center">
					<Card.Title class="mb-4 text-3xl font-bold">Join a Group</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="mx-auto mb-8 max-w-2xl text-gray-700">
						Interested in joining one of our groups? Connect with like-minded peers, work on
						exciting projects, and advance your skills in your area of interest.
					</p>
					<div class="mb-8 grid gap-6 md:grid-cols-3">
						<div class="text-center">
							<div
								class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
							>
								<span class="text-xl font-bold text-blue-600">1</span>
							</div>
							<h4 class="mb-2 font-semibold">Explore Groups</h4>
							<p class="text-sm text-gray-600">
								Browse our available groups and find your interests
							</p>
						</div>
						<div class="text-center">
							<div
								class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
							>
								<span class="text-xl font-bold text-green-600">2</span>
							</div>
							<h4 class="mb-2 font-semibold">Contact Us</h4>
							<p class="text-sm text-gray-600">Reach out to express your interest in joining</p>
						</div>
						<div class="text-center">
							<div
								class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100"
							>
								<span class="text-xl font-bold text-sky-600">3</span>
							</div>
							<h4 class="mb-2 font-semibold">Get Involved</h4>
							<p class="text-sm text-gray-600">
								Start participating in group activities and projects
							</p>
						</div>
					</div>
					<Button size="lg" class="px-8">Contact Us to Join</Button>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>

<!-- Group Details Dialog -->
{#if selectedGroup}
	<Dialog.Root open={!!selectedGroup} onOpenChange={(open) => !open && (selectedGroup = null)}>
		<Dialog.Content class="max-w-lg">
			<Dialog.Header>
				<Dialog.Title>{selectedGroup.Title}</Dialog.Title>
				<Dialog.Description>
					<Badge variant="outline">
						{selectedGroup.Type === 'COMMITTEE' ? 'Committee' : 'Special Interest Group'}
					</Badge>
				</Dialog.Description>
			</Dialog.Header>

			<div class="space-y-4">
				{#if selectedGroup.Description}
					<div>
						<h4 class="mb-2 font-medium">About</h4>
						<p class="text-sm text-muted-foreground">{selectedGroup.Description}</p>
					</div>
				{/if}

				<div>
					<h4 class="mb-2 font-medium">
						Members ({selectedGroup.members.filter((m: any) => m.user).length})
					</h4>
					{#if selectedGroup.members.filter((m: any) => m.user).length > 0}
						<div class="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto">
							{#each selectedGroup.members.filter((m: any) => m.user) as member}
								{#if member.user}
									<div class="flex items-center gap-2 rounded-lg bg-muted p-2">
										{#if member.user.ProfilePicture}
											<img
												src={member.user.ProfilePicture}
												alt="{member.user.FirstName} {member.user.LastName}"
												class="h-8 w-8 rounded-full object-cover"
											/>
										{:else}
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10"
											>
												<span class="text-xs font-medium">
													{member.user.FirstName[0]}{member.user.LastName[0]}
												</span>
											</div>
										{/if}
										<span class="truncate text-sm font-medium">
											{member.user.FirstName}
											{member.user.LastName}
										</span>
									</div>
								{/if}
							{/each}
						</div>
					{:else}
						<div class="py-4 text-center text-sm text-muted-foreground">No members yet</div>
					{/if}
				</div>

				<div class="text-xs text-muted-foreground">
					Created: {new Date(selectedGroup.CreatedAt).toLocaleDateString()}
				</div>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="outline" onclick={() => (selectedGroup = null)}>Close</Button>
				<Button>Join Group</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
