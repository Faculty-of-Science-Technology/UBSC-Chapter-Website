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
	const upcomingEvents = data.events.filter(
		(event) => event.eventStartTime && new Date(event.eventStartTime) > now
	);
	const pastEvents = data.events.filter(
		(event) => event.eventStartTime && new Date(event.eventStartTime) <= now
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
	<meta
		name="description"
		content="Through deliberate planning by the chapter officers, every year the ACM Chapter hosts events to allow members to network, use their skills, and learn new skills. Additionaly, the Chapter incorporates events designed to cultivate a passion for technology in young participants and university students."
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
				text="Events & Activities"
				subtitle="Through deliberate planning by the chapter officers, every year the ACM Chapter hosts events to allow members to network, use their skills, and learn new skills. Additionaly, the Chapter incorporates events designed to cultivate a passion for technology in young participants and university students."
			/>
		</section>

		<!-- Statistics Section -->
		<section class="w-full">
			<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-blue-600"
							>{data.statistics.totalEvents}</Card.Title
						>
						<p class="text-sm text-gray-600">Total Events</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-green-600"
							>{upcomingEvents.length}</Card.Title
						>
						<p class="text-sm text-gray-600">Upcoming Events</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-sky-600"
							>{data.statistics.totalAttendees}</Card.Title
						>
						<p class="text-sm text-gray-600">Total Attendees</p>
					</Card.Header>
				</Card.Root>
				<Card.Root class="p-6 text-center">
					<Card.Header>
						<Card.Title class="text-3xl font-bold text-orange-600"
							>{data.statistics.totalGroups}</Card.Title
						>
						<p class="text-sm text-gray-600">Active Groups</p>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Event Types Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Types of Events</h2>
				<p class="mx-auto max-w-2xl text-gray-600">
					We organize a variety of events to cater to different interests and skill levels
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<svg
								class="h-8 w-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Workshops</Card.Title>
						<Card.Description class="text-sm">
							Hands-on technical workshops covering the latest technologies and programming
							languages.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Networking</Card.Title>
						<Card.Description class="text-sm">
							Connect with industry professionals, alumni, and fellow students in informal settings.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100"
						>
							<svg
								class="h-8 w-8 text-sky-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Seminars</Card.Title>
						<Card.Description class="text-sm">
							Educational talks by industry experts on emerging technologies and career development.
						</Card.Description>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"
						>
							<svg
								class="h-8 w-8 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Hackathons</Card.Title>
						<Card.Description class="text-sm">
							Intensive coding competitions and collaborative problem-solving events.
						</Card.Description>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Upcoming Events Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Upcoming Events</h2>
				<p class="mx-auto max-w-2xl text-gray-600">
					Don't miss out on these exciting upcoming opportunities to learn, network, and grow
				</p>
			</div>

			{#if upcomingEvents.length > 0}
				<!-- Masonry Grid for Upcoming Events -->
				<div class="w-full columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
					{#each upcomingEvents as event}
						{@const status = getEventStatus(event)}
						<div class="mb-4 break-inside-avoid">
							<button
								class="group w-full text-left transition-transform hover:scale-105"
								onclick={() => (selectedEvent = event)}
							>
								<div class="relative overflow-hidden rounded-lg border bg-card shadow-sm">
									<!-- Featured Badge -->
									{#if event.featured}
										<div class="absolute right-2 top-2 z-10">
											<Badge variant="secondary" class="bg-yellow-500 text-white">Featured</Badge>
										</div>
									{/if}

									<!-- Event Image with Name Overlay -->
									<AspectRatio
										ratio={16 / 9}
										class="relative overflow-hidden bg-gradient-to-br from-blue-500 to-green-600"
									>
										<div class="absolute inset-0 bg-black/40"></div>
										<div class="absolute inset-0 flex flex-col justify-start p-4 text-white">
											<h3 class="mb-2 text-xl font-bold text-white drop-shadow-lg">
												{event.title}
											</h3>
											<div class="mt-auto">
												<div class="mb-2 flex flex-wrap gap-2">
													<Badge variant="secondary" class="border-white/20 bg-white/20 text-white">
														{formatPrice(event.eventPrice)}
													</Badge>
													<Badge
														variant="secondary"
														class={`${status.color === 'green' ? 'bg-green-500/80' : status.color === 'blue' ? 'bg-blue-500/80' : 'bg-red-500/80'} border-white/20 text-white`}
													>
														{status.text}
													</Badge>
												</div>
											</div>
										</div>
									</AspectRatio>

									<!-- Event Content -->
									<div class="space-y-3 p-4">
										<div class="space-y-2 text-sm">
											<div class="flex items-center gap-2 text-muted-foreground">
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span>{formatDate(event.eventStartTime)}</span>
											</div>

											{#if event.eventLocation}
												<div class="flex items-center gap-2 text-muted-foreground">
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
													<span class="truncate">{event.eventLocation}</span>
												</div>
											{/if}

											{#if event.eventCapacity}
												<div class="flex items-center gap-2 text-muted-foreground">
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
														/>
													</svg>
													<span>{event.attendeeCount || 0}/{event.eventCapacity} attendees</span>
												</div>
											{/if}
										</div>

										<!-- Event Summary -->
										{#if event.content && event.content.length > 100}
											<p class="line-clamp-3 text-sm text-muted-foreground">
												{event.content.substring(0, 150)}...
											</p>
										{:else if event.content}
											<p class="line-clamp-3 text-sm text-muted-foreground">
												{event.content}
											</p>
										{/if}
									</div>
								</div>
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<Card.Root class="p-12 text-center">
					<Card.Content>
						<p class="text-lg text-gray-600">No upcoming events scheduled at the moment.</p>
						<p class="mt-2 text-sm text-gray-500">Check back soon for new events!</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</section>

		<!-- Past Events Section -->
		{#if pastEvents.length > 0}
			<section class="w-full">
				<div class="mb-12 text-center">
					<h2 class="mb-4 text-3xl font-bold">Past Events</h2>
					<p class="mx-auto max-w-2xl text-gray-600">
						Take a look at some of the amazing events we've organized in the past
					</p>
				</div>

				<!-- Masonry Grid for Past Events -->
				<div class="w-full columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
					{#each pastEvents.slice(0, 9) as event}
						{@const status = getEventStatus(event)}
						<div class="mb-4 break-inside-avoid">
							<button
								class="group w-full text-left opacity-90 transition-transform hover:scale-105 hover:opacity-100"
								onclick={() => (selectedEvent = event)}
							>
								<div class="relative overflow-hidden rounded-lg border bg-card shadow-sm">
									<!-- Event Image with Name Overlay -->
									<AspectRatio
										ratio={16 / 9}
										class="relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-700"
									>
										<div class="absolute inset-0 bg-black/50"></div>
										<div class="absolute inset-0 flex flex-col justify-start p-4 text-white">
											<h3 class="mb-2 text-xl font-bold text-white drop-shadow-lg">
												{event.title}
											</h3>
											<div class="mt-auto">
												<div class="mb-2 flex flex-wrap gap-2">
													<Badge variant="secondary" class="border-white/20 bg-white/20 text-white">
														{formatPrice(event.eventPrice)}
													</Badge>
													<Badge
														variant="secondary"
														class="border-white/20 bg-gray-500/80 text-white"
													>
														{status.text}
													</Badge>
												</div>
											</div>
										</div>
									</AspectRatio>

									<!-- Event Content -->
									<div class="space-y-3 p-4">
										<div class="space-y-2 text-sm">
											<div class="flex items-center gap-2 text-muted-foreground">
												<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span>{formatDate(event.eventStartTime)}</span>
											</div>

											{#if event.eventLocation}
												<div class="flex items-center gap-2 text-muted-foreground">
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
													<span class="truncate">{event.eventLocation}</span>
												</div>
											{/if}

											{#if event.attendeeCount}
												<div class="flex items-center gap-2 text-muted-foreground">
													<svg
														class="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
														/>
													</svg>
													<span>{event.attendeeCount} attended</span>
												</div>
											{/if}
										</div>

										<!-- Event Summary -->
										{#if event.content && event.content.length > 100}
											<p class="line-clamp-3 text-sm text-muted-foreground">
												{event.content.substring(0, 150)}...
											</p>
										{:else if event.content}
											<p class="line-clamp-3 text-sm text-muted-foreground">
												{event.content}
											</p>
										{/if}

										<!-- Past Event Indicator -->
										<div class="flex items-center gap-2 pt-2">
											<Badge variant="outline" class="text-xs">Past Event</Badge>
											{#if event.authorName}
												<Badge variant="secondary" class="text-xs">
													By {event.authorName}
													{event.authorLastName}
												</Badge>
											{/if}
										</div>
									</div>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Call to Action Section -->
		<section class="w-full">
			<Card.Root class="bg-gradient-to-r from-blue-50 to-sky-50 p-12">
				<Card.Header class="text-center">
					<Card.Title class="mb-4 text-3xl font-bold">Stay Updated</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="mx-auto mb-8 max-w-2xl text-gray-700">
						Don't miss out on our upcoming events! Join our community to receive notifications about
						new workshops, seminars, and networking opportunities.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button size="lg" class="px-8">Join Our Community</Button>
						<Button variant="outline" size="lg" class="px-8">Follow Us on Social Media</Button>
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
						<h4 class="mb-2 font-medium">Description</h4>
						<p class="text-sm text-muted-foreground">{selectedEvent.content}</p>
					</div>
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div>
						<h4 class="mb-1 font-medium">Date & Time</h4>
						<p class="text-sm text-muted-foreground">{formatDate(selectedEvent.eventStartTime)}</p>
					</div>
					<div>
						<h4 class="mb-1 font-medium">Location</h4>
						<p class="text-sm text-muted-foreground">{selectedEvent.eventLocation || 'TBD'}</p>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<h4 class="mb-1 font-medium">Price</h4>
						<p class="text-sm text-muted-foreground">{formatPrice(selectedEvent.eventPrice)}</p>
					</div>
					{#if selectedEvent.eventCapacity}
						<div>
							<h4 class="mb-1 font-medium">Capacity</h4>
							<p class="text-sm text-muted-foreground">
								{selectedEvent.attendeeCount || 0} / {selectedEvent.eventCapacity}
							</p>
						</div>
					{/if}
				</div>

				{#if selectedEvent.authorName}
					<div>
						<h4 class="mb-1 font-medium">Organized by</h4>
						<p class="text-sm text-muted-foreground">
							{selectedEvent.authorName}
							{selectedEvent.authorLastName}
						</p>
					</div>
				{/if}
			</div>

			<div class="flex justify-end gap-2 pt-4">
				<Button variant="outline" onclick={() => (selectedEvent = null)}>Close</Button>
				{#if new Date(selectedEvent.eventStartTime) > new Date()}
					<Button>Register</Button>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
