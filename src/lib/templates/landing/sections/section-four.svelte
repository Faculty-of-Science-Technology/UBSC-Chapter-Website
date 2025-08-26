<!-- Section Four of landing page -->
<script lang="ts">
	import { AspectRatio } from '$lib/components/vendor/ui/aspect-ratio/index.js';
	import { Badge } from '$lib/components/vendor/ui/badge/index.js';
	import * as Dialog from '$lib/components/vendor/ui/dialog/index.js';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import BadgeCheckIcon from 'lucide-svelte/icons/badge-check';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import MapPinIcon from 'lucide-svelte/icons/map-pin';
	import UsersIcon from 'lucide-svelte/icons/users';

	interface Event {
		Id: string;
		Title: string;
		Content: string;
		Excerpt: string | null;
		Type: 'EVENT' | 'BLOG';
		Published: boolean;
		FeaturedImage: string | null;
		EventStartTime: Date | null;
		EventEndTime: Date | null;
		EventLocation: string | null;
		EventMaxAttendees: number | null;
		EventCurrentAttendees: number;
		EventPrice: number | null;
		CreatedAt: Date;
		UpdatedAt: Date;
		Slug: string;
		AuthorId: string;
		AgendaId: string | null;
		PublishedAt: Date | null;
		GroupId: string | null;
		author: {
			FirstName: string;
			LastName: string;
			ProfilePicture: string | null;
		};
		attendees?: Array<{
			UserId: string;
			Status: string;
		}>;
	}

	interface Props {
		statistics: {
			totalMembers: number;
			totalEvents: number;
			totalGroups: number;
			totalPosts: number;
			activeGroups: number;
		};
		recentPosts: Event[];
	}

	let { statistics, recentPosts }: Props = $props();
	
	// Filter to show only published events
	const events = recentPosts.filter(post => post.Type === 'EVENT' && post.Published);
	
	// Determine featured event (most recent or first one)
	const featuredEvent = events[0];
	
	// State for dialog
	let selectedEvent: Event | null = $state(null);

	// Helper function to format date
	function formatDate(date: Date | null): string {
		if (!date) return 'Date TBD';
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Helper function to format time
	function formatTime(date: Date | null): string {
		if (!date) return '';
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}
</script>


<assembly class="flex flex-col items-start justify-between gap-6">
	<div class="flex flex-row">
		<HeroBlock class="flex-1" no_signup prelude="Make a Difference." text="Chapter Events"></HeroBlock>
		<HeroBlock
			class="flex-1"
			no_signup
			prelude="About Chapter Events"
			subtitle="All work and no fun? That sounds like the ACM. Although, we do believe socializing is an important aspect of professional development. Socialize, learn, network and let loose at many of our successful Events! We have hosted {statistics.totalEvents} events so far."
		></HeroBlock>
	</div>

	<!-- Masonry Grid for Events -->
	<div class="w-full columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
		{#each events as event, index (event.Id)}
			<div class="break-inside-avoid mb-4">
				<button 
					class="w-full text-left transition-transform hover:scale-105 group"
					onclick={() => selectedEvent = event}
				>
					<div class="relative overflow-hidden rounded-lg border bg-card shadow-sm">
						<!-- Featured Badge -->
						{#if event.Id === featuredEvent?.Id}
							<div class="absolute top-2 right-2 z-10">
								<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
									<BadgeCheckIcon class="w-3 h-3 mr-1" />
									Featured
								</Badge>
							</div>
						{/if}

						<!-- Event Image -->
						{#if event.FeaturedImage}
							<AspectRatio ratio={16 / 9} class="overflow-hidden">
								<img 
									src={event.FeaturedImage} 
									alt={event.Title}
									class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
								/>
							</AspectRatio>
						{:else}
							<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-blue-500 to-sky-600">
								<div class="flex items-center justify-center h-full">
									<CalendarIcon class="w-12 h-12 text-white/80" />
								</div>
							</AspectRatio>
						{/if}

						<!-- Event Content -->
						<div class="p-4 space-y-3">
							<div>
								<h3 class="font-bold text-lg mb-1 line-clamp-2">{event.Title}</h3>
								{#if event.Excerpt}
									<p class="text-sm text-muted-foreground line-clamp-3">
										{event.Excerpt}
									</p>
								{/if}
							</div>

							<!-- Event Details -->
							<div class="space-y-2 text-sm">
								{#if event.EventStartTime}
									<div class="flex items-center gap-2 text-muted-foreground">
										<CalendarIcon class="w-4 h-4" />
										<span>{formatDate(event.EventStartTime)}</span>
										{#if formatTime(event.EventStartTime)}
											<span>at {formatTime(event.EventStartTime)}</span>
										{/if}
									</div>
								{/if}

								{#if event.EventLocation}
									<div class="flex items-center gap-2 text-muted-foreground">
										<MapPinIcon class="w-4 h-4" />
										<span class="truncate">{event.EventLocation}</span>
									</div>
								{/if}

								{#if event.EventMaxAttendees}
									<div class="flex items-center gap-2 text-muted-foreground">
										<UsersIcon class="w-4 h-4" />
										<span>{event.EventCurrentAttendees}/{event.EventMaxAttendees} attendees</span>
									</div>
								{/if}
							</div>

							<!-- Event Badges -->
							<div class="flex flex-wrap gap-1">
								{#if event.EventPrice === null || event.EventPrice === 0}
									<Badge variant="outline" class="text-xs">Free</Badge>
								{:else}
									<Badge variant="outline" class="text-xs">${event.EventPrice}</Badge>
								{/if}
								
								<Badge variant="secondary" class="text-xs">
									By {event.author.FirstName} {event.author.LastName}
								</Badge>
							</div>
						</div>
					</div>
				</button>
			</div>
		{/each}
		
		{#if events.length === 0}
			<div class="col-span-full">
				<div class="text-center py-12 text-muted-foreground flex flex-col gap-2">
					<CalendarIcon class="w-16 h-16 mx-auto mb-4 opacity-50" />
					<p class="text-lg font-medium">No Events Scheduled</p>
					<p class="text-sm">Check back later for upcoming chapter events!</p>
				</div>
			</div>
		{/if}
	</div>
</assembly>

<!-- Event Details Dialog -->
{#if selectedEvent}
	<Dialog.Root open={!!selectedEvent} onOpenChange={(open) => !open && (selectedEvent = null)}>
		<Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
			<Dialog.Header>
				<Dialog.Title>{selectedEvent.Title}</Dialog.Title>
				<Dialog.Description>
					Chapter Event Details
				</Dialog.Description>
			</Dialog.Header>
			
			<div class="space-y-6">
				<!-- Featured Image -->
				{#if selectedEvent.FeaturedImage}
					<AspectRatio ratio={16 / 9} class="overflow-hidden rounded-lg">
						<img 
							src={selectedEvent.FeaturedImage} 
							alt={selectedEvent.Title}
							class="object-cover w-full h-full"
						/>
					</AspectRatio>
				{/if}

				<!-- Event Details -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if selectedEvent.EventStartTime}
						<div class="flex items-center gap-3">
							<CalendarIcon class="w-5 h-5 text-muted-foreground" />
							<div>
								<p class="font-medium">Date & Time</p>
								<p class="text-sm text-muted-foreground">
									{formatDate(selectedEvent.EventStartTime)}
									{#if formatTime(selectedEvent.EventStartTime)}
										<br />at {formatTime(selectedEvent.EventStartTime)}
									{/if}
									{#if selectedEvent.EventEndTime && formatTime(selectedEvent.EventEndTime)}
										- {formatTime(selectedEvent.EventEndTime)}
									{/if}
								</p>
							</div>
						</div>
					{/if}

					{#if selectedEvent.EventLocation}
						<div class="flex items-center gap-3">
							<MapPinIcon class="w-5 h-5 text-muted-foreground" />
							<div>
								<p class="font-medium">Location</p>
								<p class="text-sm text-muted-foreground">{selectedEvent.EventLocation}</p>
							</div>
						</div>
					{/if}

					{#if selectedEvent.EventMaxAttendees}
						<div class="flex items-center gap-3">
							<UsersIcon class="w-5 h-5 text-muted-foreground" />
							<div>
								<p class="font-medium">Attendees</p>
								<p class="text-sm text-muted-foreground">
									{selectedEvent.EventCurrentAttendees} / {selectedEvent.EventMaxAttendees} registered
								</p>
							</div>
						</div>
					{/if}

					{#if selectedEvent.EventPrice !== null}
						<div class="flex items-center gap-3">
							<div class="w-5 h-5 flex items-center justify-center">
								<span class="text-lg">💰</span>
							</div>
							<div>
								<p class="font-medium">Price</p>
								<p class="text-sm text-muted-foreground">
									{selectedEvent.EventPrice === 0 ? 'Free' : `$${selectedEvent.EventPrice}`}
								</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Event Description -->
				<div>
					<h4 class="font-medium mb-2">About This Event</h4>
					<div class="prose prose-sm max-w-none text-muted-foreground">
						{@html selectedEvent.Content || selectedEvent.Excerpt || 'No description available.'}
					</div>
				</div>

				<!-- Event Organizer -->
				<div>
					<h4 class="font-medium mb-2">Organized By</h4>
					<div class="flex items-center gap-3 p-3 rounded-lg bg-muted">
						{#if selectedEvent.author.ProfilePicture}
							<img 
								src={selectedEvent.author.ProfilePicture} 
								alt="{selectedEvent.author.FirstName} {selectedEvent.author.LastName}"
								class="w-10 h-10 rounded-full object-cover"
							/>
						{:else}
							<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
								<span class="text-sm font-medium">
									{selectedEvent.author.FirstName[0]}{selectedEvent.author.LastName[0]}
								</span>
							</div>
						{/if}
						<div>
							<p class="font-medium">{selectedEvent.author.FirstName} {selectedEvent.author.LastName}</p>
							<p class="text-sm text-muted-foreground">Event Organizer</p>
						</div>
					</div>
				</div>

				<!-- Event Status Badges -->
				<div class="flex flex-wrap gap-2">
					{#if selectedEvent.Id === featuredEvent?.Id}
						<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
							<BadgeCheckIcon class="w-3 h-3 mr-1" />
							Featured Event
						</Badge>
					{/if}
					{#if selectedEvent.EventPrice === null || selectedEvent.EventPrice === 0}
						<Badge variant="outline">Free Event</Badge>
					{/if}
					<Badge variant="secondary">Chapter Event</Badge>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
