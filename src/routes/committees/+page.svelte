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
	let selectedCommittee: any = $state(null);
	
	// Filter to show only committees
	const committees = data.groups.filter(group => group.Type === 'COMMITTEE' && group.IsActive);
</script>

<svelte:head>
	<title>Committees - UBSC Chapter</title>
	<meta name="description" content="Learn about the various committees that drive the operations and initiatives of the University of Belize ACM Chapter." />
</svelte:head>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-80">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				text_light_blue="Chapter"
				text="Committees"
				subtitle="Our committees are the backbone of our organization, working tirelessly to organize events, manage operations, and drive strategic initiatives that benefit all members."
			/>
		</section>

		<!-- Statistics Section -->
		<section class="w-full">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-blue-600">{committees.length}</Card.Title>
						<p class="text-sm text-gray-600">Active Committees</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-green-600">{data.statistics.totalCommitteeMembers}</Card.Title>
						<p class="text-sm text-gray-600">Committee Members</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-purple-600">{data.statistics.totalEvents}</Card.Title>
						<p class="text-sm text-gray-600">Events Organized</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-orange-600">{data.statistics.totalGroups}</Card.Title>
						<p class="text-sm text-gray-600">Total Groups</p>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Committee Types Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Committee Structure</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Our committees are organized to efficiently manage different aspects of chapter operations
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<Card.Title class="text-xl mb-3">Event Planning</Card.Title>
						<Card.Description>
							Organizing workshops, seminars, networking events, and social gatherings for the chapter community.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
							</svg>
						</div>
						<Card.Title class="text-xl mb-3">Finance & Operations</Card.Title>
						<Card.Description>
							Managing chapter finances, budgets, sponsorships, and day-to-day operational activities.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
							</svg>
						</div>
						<Card.Title class="text-xl mb-3">Marketing & Outreach</Card.Title>
						<Card.Description>
							Promoting chapter activities, managing social media, and building relationships with external organizations.
						</Card.Description>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Active Committees Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Our Committees</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Meet the dedicated committees that make our chapter activities possible
				</p>
			</div>

			{#if committees.length > 0}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each committees as committee}
						<Card.Root class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => selectedCommittee = committee}>
							<div class="p-1">
								<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-green-500 to-blue-600 relative overflow-hidden rounded-lg">
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="font-bold text-lg mb-1">{committee.Title}</h3>
										<p class="text-sm opacity-90 line-clamp-2">
											{committee.Description || 'A committee dedicated to chapter operations and success'}
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
						<p class="text-gray-600 text-lg">No active committees are currently displayed.</p>
						<p class="text-gray-500 text-sm mt-2">Committee information will be updated soon.</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- Join Committee Section -->
		<section class="w-full">
			<Card.Root class="p-12 bg-gradient-to-r from-green-50 to-blue-50">
				<Card.Header class="text-center">
					<Card.Title class="text-3xl font-bold mb-4">Join a Committee</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="text-gray-700 mb-8 max-w-2xl mx-auto">
						Want to make a real impact on our chapter? Join one of our committees and help shape 
						the future of technology education at the University of Belize.
					</p>
					
					<div class="grid md:grid-cols-2 gap-8 mb-8">
						<div>
							<h4 class="font-semibold text-lg mb-3">Why Join a Committee?</h4>
							<ul class="text-left space-y-2 text-gray-600">
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Develop leadership skills
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Build your network
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Gain hands-on experience
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Make a meaningful impact
								</li>
							</ul>
						</div>
						
						<div>
							<h4 class="font-semibold text-lg mb-3">What We Look For</h4>
							<ul class="text-left space-y-2 text-gray-600">
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Enthusiasm and commitment
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Collaborative mindset
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Willingness to learn
								</li>
								<li class="flex items-center gap-2">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
									</svg>
									Creative problem-solving
								</li>
							</ul>
						</div>
					</div>
					
					<Button size="lg" class="px-8">
						Apply to Join a Committee
					</Button>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>

<!-- Committee Details Dialog -->
{#if selectedCommittee}
	<Dialog.Root open={!!selectedCommittee} onOpenChange={(open) => !open && (selectedCommittee = null)}>
		<Dialog.Content class="max-w-lg">
			<Dialog.Header>
				<Dialog.Title>{selectedCommittee.Title}</Dialog.Title>
				<Dialog.Description>
					<Badge variant="outline">Committee</Badge>
				</Dialog.Description>
			</Dialog.Header>
			
			<div class="space-y-4">
				{#if selectedCommittee.Description}
					<div>
						<h4 class="font-medium mb-2">About</h4>
						<p class="text-sm text-muted-foreground">{selectedCommittee.Description}</p>
					</div>
				{/if}
				
				<div>
					<h4 class="font-medium mb-2">Committee Members ({selectedCommittee.members.filter((m: any) => m.user).length})</h4>
					{#if selectedCommittee.members.filter((m: any) => m.user).length > 0}
						<div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
							{#each selectedCommittee.members.filter((m: any) => m.user) as member}
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
					Created: {new Date(selectedCommittee.CreatedAt).toLocaleDateString()}
				</div>
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="outline" onclick={() => selectedCommittee = null}>
					Close
				</Button>
				<Button>
					Join Committee
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
