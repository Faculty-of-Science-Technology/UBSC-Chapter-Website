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
	let selectedEvent: any = $state(null);
	
	// Separate upcoming and past events
	const now = new Date();
	const upcomingEvents = data.events.filter(event => 
		event.eventStartTime && new Date(event.eventStartTime) > now
	);
	const pastEvents = data.events.filter(event => 
		event.eventStartTime && new Date(event.eventStartTime) <= now
	);
	
	function formatDate(dateString: string | Date | null) {
		if (!dateString) return 'Date TBD';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	function formatPrice(price: number | null) {
		if (price === undefined || price === null || price === 0) return 'Free';
		return `$${price.toFixed(2)}`;
	}
	
	function getEventStatus(event: any) {
		if (!event.eventStartTime) return { text: 'TBD', color: 'gray' };
		const eventStartTime = new Date(event.eventStartTime);
		if (eventStartTime < now) return { text: 'Past', color: 'red' };
		if (eventStartTime > now) return { text: 'Upcoming', color: 'green' };
		return { text: 'Live', color: 'blue' };
	}
</script>

<svelte:head>
	<title>Events - UBSC Chapter</title>
	<meta name="description" content="Discover upcoming workshops, seminars, networking events, and other activities organized by the University of Belize ACM Chapter." />
</svelte:head>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-80">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				text_light_blue="Chapter"
				text="Events & Activities"
				subtitle="Join us for workshops, seminars, networking events, and other exciting activities that will help you grow your skills, expand your network, and advance your career in technology."
			/>
		</section>

		<!-- Statistics Section -->
		<section class="w-full">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-blue-600">{data.statistics.totalEvents}</Card.Title>
						<p class="text-sm text-gray-600">Total Events</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-green-600">{upcomingEvents.length}</Card.Title>
						<p class="text-sm text-gray-600">Upcoming Events</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-purple-600">{data.statistics.totalAttendees}</Card.Title>
						<p class="text-sm text-gray-600">Total Attendees</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="text-center p-6">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-orange-600">{data.statistics.totalGroups}</Card.Title>
						<p class="text-sm text-gray-600">Active Groups</p>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Event Types Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Types of Events</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					We organize a variety of events to cater to different interests and skill levels
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
						</div>
						<Card.Title class="text-lg mb-2">Workshops</Card.Title>
						<Card.Description class="text-sm">
							Hands-on technical workshops covering the latest technologies and programming languages.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<Card.Title class="text-lg mb-2">Networking</Card.Title>
						<Card.Description class="text-sm">
							Connect with industry professionals, alumni, and fellow students in informal settings.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<Card.Title class="text-lg mb-2">Seminars</Card.Title>
						<Card.Description class="text-sm">
							Educational talks by industry experts on emerging technologies and career development.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<Card.Title class="text-lg mb-2">Hackathons</Card.Title>
						<Card.Description class="text-sm">
							Intensive coding competitions and collaborative problem-solving events.
						</Card.Description>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Upcoming Events Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Upcoming Events</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Don't miss out on these exciting upcoming opportunities to learn, network, and grow
				</p>
			</div>

			{#if upcomingEvents.length > 0}
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each upcomingEvents as event}
						{@const status = getEventStatus(event)}
						<Card.Root class="hover:shadow-lg transition-shadow cursor-pointer" onclick={() => selectedEvent = event}>
							<div class="p-1">
								<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-blue-500 to-green-600 relative overflow-hidden rounded-lg">
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="font-bold text-lg mb-1">{event.title}</h3>
										<p class="text-sm opacity-90 line-clamp-2">
											{formatDate(event.eventStartTime)}
										</p>
										<p class="text-xs opacity-75 mb-2">
											{event.eventLocation || 'Location TBD'}
										</p>
										<div class="flex items-center gap-2">
											<Badge variant="secondary" class="bg-white/20 text-white border-white/20">
												{formatPrice(event.eventPrice)}
											</Badge>
											<Badge variant="secondary" class={`${status.color === 'green' ? 'bg-green-500/80' : status.color === 'blue' ? 'bg-blue-500/80' : 'bg-red-500/80'} text-white border-white/20`}>
												{status.text}
											</Badge>
											{#if event.featured}
												<Badge variant="secondary" class="bg-yellow-500/80 text-white border-white/20">
													Featured
												</Badge>
											{/if}
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
						<p class="text-gray-600 text-lg">No upcoming events scheduled at the moment.</p>
						<p class="text-gray-500 text-sm mt-2">Check back soon for new events!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- Past Events Section -->
		{#if pastEvents.length > 0}
			<section class="w-full">
				<div class="text-center mb-12">
					<h2 class="text-3xl font-bold mb-4">Past Events</h2>
					<p class="text-gray-600 max-w-2xl mx-auto">
						Take a look at some of the amazing events we've organized in the past
					</p>
				</div>

				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each pastEvents.slice(0, 6) as event}
						{@const status = getEventStatus(event)}
						<Card.Root class="hover:shadow-lg transition-shadow cursor-pointer opacity-75" onclick={() => selectedEvent = event}>
							<div class="p-1">
								<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-gray-500 to-gray-700 relative overflow-hidden rounded-lg">
									<div class="absolute inset-0 bg-black/40"></div>
									<div class="absolute inset-0 flex flex-col justify-end p-4 text-white">
										<h3 class="font-bold text-lg mb-1">{event.title}</h3>
										<p class="text-sm opacity-90 line-clamp-2">
											{formatDate(event.eventStartTime)}
										</p>
										<p class="text-xs opacity-75 mb-2">
											{event.eventLocation || 'Location TBD'}
										</p>
										<div class="flex items-center gap-2">
											<Badge variant="secondary" class="bg-white/20 text-white border-white/20">
												{formatPrice(event.eventPrice)}
											</Badge>
											<Badge variant="secondary" class="bg-gray-500/80 text-white border-white/20">
												{status.text}
											</Badge>
										</div>
									</div>
								</AspectRatio>
							</div>
						</Card.Root>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Call to Action Section -->
		<section class="w-full">
			<Card.Root class="p-12 bg-gradient-to-r from-blue-50 to-purple-50">
				<Card.Header class="text-center">
					<Card.Title class="text-3xl font-bold mb-4">Stay Updated</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="text-gray-700 mb-8 max-w-2xl mx-auto">
						Don't miss out on our upcoming events! Join our community to receive notifications 
						about new workshops, seminars, and networking opportunities.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" class="px-8">
							Join Our Community
						</Button>
						<Button variant="outline" size="lg" class="px-8">
							Follow Us on Social Media
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>

<!-- Event Details Dialog -->
{#if selectedEvent}
	<Dialog.Root open={!!selectedEvent} onOpenChange={(open) => !open && (selectedEvent = null)}>
		<Dialog.Content class="max-w-lg">
			<Dialog.Header>
				<Dialog.Title>{selectedEvent.title}</Dialog.Title>
				<Dialog.Description>
					{#if selectedEvent.groupId}
						{#each data.availableGroups as group}
							{#if group.id === selectedEvent.groupId}
								<Badge variant="outline">{group.name}</Badge>
							{/if}
						{/each}
					{:else}
						<Badge variant="outline">General Event</Badge>
					{/if}
				</Dialog.Description>
			</Dialog.Header>
			
			<div class="space-y-4">
				{#if selectedEvent.content}
					<div>
						<h4 class="font-medium mb-2">Description</h4>
						<p class="text-sm text-muted-foreground">{selectedEvent.content}</p>
					</div>
				{/if}
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h4 class="font-medium mb-1">Date & Time</h4>
						<p class="text-sm text-muted-foreground">{formatDate(selectedEvent.eventStartTime)}</p>
					</div>
					<div>
						<h4 class="font-medium mb-1">Location</h4>
						<p class="text-sm text-muted-foreground">{selectedEvent.eventLocation || 'TBD'}</p>
					</div>
				</div>
				
				<div class="grid grid-cols-2 gap-4">
					<div>
						<h4 class="font-medium mb-1">Price</h4>
						<p class="text-sm text-muted-foreground">{formatPrice(selectedEvent.eventPrice)}</p>
					</div>
					{#if selectedEvent.eventCapacity}
						<div>
							<h4 class="font-medium mb-1">Capacity</h4>
							<p class="text-sm text-muted-foreground">{selectedEvent.attendeeCount || 0} / {selectedEvent.eventCapacity}</p>
						</div>
					{/if}
				</div>
				
				{#if selectedEvent.authorName}
					<div>
						<h4 class="font-medium mb-1">Organized by</h4>
						<p class="text-sm text-muted-foreground">{selectedEvent.authorName} {selectedEvent.authorLastName}</p>
					</div>
				{/if}
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="outline" onclick={() => selectedEvent = null}>
					Close
				</Button>
				{#if new Date(selectedEvent.eventStartTime) > new Date()}
					<Button>
						Register
					</Button>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
