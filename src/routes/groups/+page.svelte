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
	const standardGroups = data.groups.filter(group => group.Type === 'STANDARD' && group.IsActive);
	const committees = data.groups.filter(group => group.Type === 'COMMITTEE' && group.IsActive);
</script>

<svelte:head>
	<title>Groups - UBSC Chapter</title>
	<meta name="description" content="Explore the various Special Interest Groups (SIGs) and committees of the University of Belize ACM Chapter." />
</svelte:head>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-80">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				text_light_blue="Chapter"
				text="Special Interest Groups"
				subtitle="Find your field of interest and develop your skills beyond the classroom. Our SIGs cater to a variety of interests, from Artificial Intelligence to Cybersecurity to Web Development - whatever your interest, there's a group for you."
			/>
		</section>

		<!-- Statistics Section -->
		<section class="w-full">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-blue-600">{data.statistics.totalGroups}</Card.Title>
						<p class="text-sm text-gray-600">Total Groups</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-green-600">{data.statistics.activeGroups}</Card.Title>
						<p class="text-sm text-gray-600">Active Groups</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-purple-600">{data.statistics.totalMembers}</Card.Title>
						<p class="text-sm text-gray-600">Total Members</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-orange-600">{committees.length}</Card.Title>
						<p class="text-sm text-gray-600">Committees</p>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Special Interest Groups Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Special Interest Groups</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Join a community of like-minded individuals passionate about specific areas of technology
				</p>
			</div>

			{#if standardGroups.length > 0}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each standardGroups as group}
						<Card.Root class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => selectedGroup = group}>
							<div class="p-1">
								<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden rounded-lg">
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="font-bold text-lg mb-1">{group.Title}</h3>
										<p class="text-sm opacity-90 line-clamp-2">
											{group.Description || 'A Special Interest Group for ACM members'}
										</p>
										<div class="flex items-center gap-2 mt-2">
											<Badge variant="secondary" class="bg-white/20 text-white border-white/20">
												SIG
											</Badge>
											<span class="text-xs">
												{group.members.filter((m: any) => m.user).length} member{group.members.filter((m: any) => m.user).length !== 1 ? 's' : ''}
											</span>
										</div>
									</div>
								</AspectRatio>
							</div>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<Card.Root class="text-center p-12">
					<Card.Content>
						<p class="text-gray-600 text-lg">No active Special Interest Groups at the moment.</p>
						<p class="text-gray-500 text-sm mt-2">Check back later for new groups!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- Committees Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Committees</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Our committees work behind the scenes to organize events, manage operations, and drive strategic initiatives
				</p>
			</div>

			{#if committees.length > 0}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each committees as committee}
						<Card.Root class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => selectedGroup = committee}>
							<div class="p-1">
								<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-green-500 to-blue-600 relative overflow-hidden rounded-lg">
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="font-bold text-lg mb-1">{committee.Title}</h3>
										<p class="text-sm opacity-90 line-clamp-2">
											{committee.Description || 'A committee dedicated to chapter operations'}
										</p>
										<div class="flex items-center gap-2 mt-2">
											<Badge variant="secondary" class="bg-white/20 text-white border-white/20">
												Committee
											</Badge>
											<span class="text-xs">
												{committee.members.filter((m: any) => m.user).length} member{committee.members.filter((m: any) => m.user).length !== 1 ? 's' : ''}
											</span>
										</div>
									</div>
								</AspectRatio>
							</div>
						</Card.Root>
					{/each}
				</div>
			{:else}
				<Card.Root class="text-center p-12">
					<Card.Content>
						<p class="text-gray-600 text-lg">No active committees at the moment.</p>
						<p class="text-gray-500 text-sm mt-2">Check back later for committee information!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- How to Join Section -->
		<section class="w-full">
			<Card.Root class="p-12 bg-gradient-to-r from-blue-50 to-purple-50">
				<Card.Header class="text-center">
					<Card.Title class="text-3xl font-bold mb-4">Join a Group</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="text-gray-700 mb-8 max-w-2xl mx-auto">
						Interested in joining one of our groups? Connect with like-minded peers, 
						work on exciting projects, and advance your skills in your area of interest.
					</p>
					<div class="grid md:grid-cols-3 gap-6 mb-8">
						<div class="text-center">
							<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="text-xl font-bold text-blue-600">1</span>
							</div>
							<h4 class="font-semibold mb-2">Explore Groups</h4>
							<p class="text-sm text-gray-600">Browse our available groups and find your interests</p>
						</div>
						<div class="text-center">
							<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="text-xl font-bold text-green-600">2</span>
							</div>
							<h4 class="font-semibold mb-2">Contact Us</h4>
							<p class="text-sm text-gray-600">Reach out to express your interest in joining</p>
						</div>
						<div class="text-center">
							<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="text-xl font-bold text-purple-600">3</span>
							</div>
							<h4 class="font-semibold mb-2">Get Involved</h4>
							<p class="text-sm text-gray-600">Start participating in group activities and projects</p>
						</div>
					</div>
					<Button size="lg" class="px-8">
						Contact Us to Join
					</Button>
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
						<h4 class="font-medium mb-2">About</h4>
						<p class="text-sm text-muted-foreground">{selectedGroup.Description}</p>
					</div>
				{/if}
				
				<div>
					<h4 class="font-medium mb-2">Members ({selectedGroup.members.filter((m: any) => m.user).length})</h4>
					{#if selectedGroup.members.filter((m: any) => m.user).length > 0}
						<div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
							{#each selectedGroup.members.filter((m: any) => m.user) as member}
								{#if member.user}
									<div class="flex items-center gap-2 p-2 rounded-lg bg-muted">
										{#if member.user.ProfilePicture}
											<img 
												src={member.user.ProfilePicture} 
												alt="{member.user.FirstName} {member.user.LastName}"
												class="w-8 h-8 rounded-full object-cover"
											/>
										{:else}
											<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
												<span class="text-xs font-medium">
													{member.user.FirstName[0]}{member.user.LastName[0]}
												</span>
											</div>
										{/if}
										<span class="text-sm font-medium truncate">
											{member.user.FirstName} {member.user.LastName}
										</span>
									</div>
								{/if}
							{/each}
						</div>
					{:else}
						<div class="text-center text-sm text-muted-foreground py-4">
							No members yet
						</div>
					{/if}
				</div>
				
				<div class="text-xs text-muted-foreground">
					Created: {new Date(selectedGroup.CreatedAt).toLocaleDateString()}
				</div>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="outline" onclick={() => selectedGroup = null}>
					Close
				</Button>
				<Button>
					Join Group
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
