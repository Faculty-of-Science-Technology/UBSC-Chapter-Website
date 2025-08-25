<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreateEvent = $state(false);
	let showEditEvent = $state(false);
	let selectedEvent: any = $state(null);
	let loading = $state(false);

	// Form data for creating new event
	let newEvent = $state({
		title: '',
		content: '',
		eventStartTime: '',
		eventLocation: '',
		eventCapacity: null as number | null,
		eventPrice: null as number | null,
		groupId: '',
		featured: false,
		published: false
	});

	// Edit event data
	let editEvent = $state({
		id: '',
		title: '',
		content: '',
		eventStartTime: '',
		eventLocation: '',
		eventCapacity: null as number | null,
		eventPrice: null as number | null,
		groupId: '',
		featured: false,
		published: false
	});

	function handleCreateEvent() {
		showCreateEvent = true;
		newEvent = {
			title: '',
			content: '',
			eventStartTime: '',
			eventLocation: '',
			eventCapacity: null,
			eventPrice: null,
			groupId: '',
			featured: false,
			published: false
		};
	}

	function handleEditEvent(event: any) {
		selectedEvent = event;
		editEvent = {
			id: event.id,
			title: event.title,
			content: event.content,
			eventStartTime: event.eventStartTime ? new Date(event.eventStartTime).toISOString().slice(0, 16) : '',
			eventLocation: event.eventLocation || '',
			eventCapacity: event.eventCapacity,
			eventPrice: event.eventPrice,
			groupId: event.groupId || '',
			featured: event.featured ?? false,
			published: event.published ?? false
		};
		showEditEvent = true;
	}

	async function submitCreateEvent() {
		loading = true;
		try {
			const response = await fetch('/dashboard/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'create', ...newEvent })
			});

			if (response.ok) {
				showCreateEvent = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating event: ' + error);
			}
		} catch (error) {
			alert('Error creating event: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitEditEvent() {
		loading = true;
		try {
			const response = await fetch('/dashboard/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'update', ...editEvent })
			});

			if (response.ok) {
				showEditEvent = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating event: ' + error);
			}
		} catch (error) {
			alert('Error updating event: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteEvent(eventId: string) {
		if (!confirm('Are you sure you want to delete this event? This action cannot be undone.'))
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', eventId })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting event: ' + error);
			}
		} catch (error) {
			alert('Error deleting event: ' + error);
		} finally {
			loading = false;
		}
	}

	async function togglePublished(eventId: string, published: boolean) {
		loading = true;
		try {
			const response = await fetch('/dashboard/events', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'toggle-published', eventId, published: !published })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating event: ' + error);
			}
		} catch (error) {
			alert('Error updating event: ' + error);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
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
		const now = new Date();
		const eventStartTime = new Date(event.eventStartTime);

		if (!event.published) return { text: 'Draft', color: 'gray' };
		if (eventStartTime < now) return { text: 'Past', color: 'red' };
		if (eventStartTime > now) return { text: 'Upcoming', color: 'green' };
		return { text: 'Live', color: 'blue' };
	}
</script>

<svelte:head>
	<title>Events - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Events</h1>
			<p class="mt-2 text-sm text-gray-700">Manage chapter events, workshops, and meetings.</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateEvent}
				class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Create Event
			</button>
		</div>
	</div>

	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
					<table class="min-w-full divide-y divide-gray-300">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
								>
									Event
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Date & Location
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Attendees
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Price
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Status
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.events as event}
								{@const status = getEventStatus(event)}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div class="ml-4">
												<div class="font-medium text-gray-900">
													{event.title}
													{#if event.featured}
														<span
															class="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
														>
															Featured
														</span>
													{/if}
												</div>
												<div class="text-gray-500">
													{#if event.groupId}
													{#each data.availableGroups as group}
														{#if group.id === event.groupId}
															{group.name} • by {event.authorName} {event.authorLastName}
														{/if}
													{/each}
													{:else}
														No group • by {event.authorName} {event.authorLastName}
													{/if}
												</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div>
											<div class="font-medium text-gray-900">
												{formatDate(event.eventStartTime)}
											</div>
											<div class="text-gray-500">
												{event.eventLocation || 'Location TBD'}
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div class="text-gray-900">
											{event.attendeeCount}
											{#if event.eventCapacity}
												/ {event.eventCapacity}
											{/if}
										</div>
										{#if event.eventCapacity}
											<div class="text-xs text-gray-500">
												{Math.round((event.attendeeCount / event.eventCapacity) * 100)}% full
											</div>
										{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{formatPrice(event.eventPrice)}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<span
											class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {status.color ===
											'gray'
												? 'bg-gray-50 text-gray-600 ring-gray-500/10'
												: ''} {status.color === 'green'
												? 'bg-green-50 text-green-700 ring-green-600/20'
												: ''} {status.color === 'red'
												? 'bg-red-50 text-red-700 ring-red-600/20'
												: ''} {status.color === 'blue'
												? 'bg-blue-50 text-blue-700 ring-blue-600/20'
												: ''}"
										>
											{status.text}
										</span>
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											onclick={() => togglePublished(event.id, event.published)}
											class="mr-4 text-indigo-600 hover:text-indigo-900"
											disabled={loading}
										>
											{event.published ? 'Unpublish' : 'Publish'}
										</button>
										<button
											onclick={() => handleEditEvent(event)}
											class="mr-4 text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</button>
										<button
											onclick={() => deleteEvent(event.id)}
											class="text-red-600 hover:text-red-900"
											disabled={loading}
										>
											Delete
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Create Event Modal -->
{#if showCreateEvent}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreateEvent = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Event</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="title">Event Title</Label>
							<Input
								type="text"
								id="title"
								bind:value={newEvent.title}
								required
							/>
						</div>

						<div>
							<Label for="content">Description</Label>
							<Textarea
								id="content"
								bind:value={newEvent.content}
								rows={4}
								required
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="eventStartTime">Date & Time</Label>
								<Input
									type="datetime-local"
									id="eventStartTime"
									bind:value={newEvent.eventStartTime}
									required
								/>
							</div>
							<div>
								<Label for="eventLocation">Location</Label>
								<Input
									type="text"
									id="eventLocation"
									bind:value={newEvent.eventLocation}
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="eventCapacity">Capacity (optional)</Label>
								<Input
									type="number"
									id="eventCapacity"
									bind:value={newEvent.eventCapacity}
									min="1"
								/>
							</div>
							<div>
								<Label for="eventPrice">Price (optional)</Label>
								<Input
									type="number"
									id="eventPrice"
									bind:value={newEvent.eventPrice}
									min="0"
									step="0.01"
								/>
							</div>
						</div>

						<div>
							<Label for="groupId">Group (optional)</Label>
							<Select.Root type="single" bind:value={newEvent.groupId}>
								<Select.Trigger class="w-full">
									{newEvent.groupId ?? "Select a group"}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="">No Group</Select.Item>
									{#each data.availableGroups as group}
										<Select.Item value={group.id}>{group.name} ({group.type})</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex items-center space-x-2">
								
								<Switch id="featured" bind:checked={newEvent.featured} />
								<Label for="featured">
									Featured Event
								</Label>
							</div>
							<div class="flex items-center space-x-2">
								<Switch id="published" bind:checked={newEvent.published} />
								<Label for="published">
									Publish immediately
								</Label>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateEvent}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Event'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateEvent = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Event Modal -->
{#if showEditEvent}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showEditEvent = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit Event</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="edit-title">Event Title</Label>
							<Input
								type="text"
								id="edit-title"
								bind:value={editEvent.title}
								required
							/>
						</div>

						<div>
							<Label for="edit-content">Description</Label>
							<Textarea
								id="edit-content"
								bind:value={editEvent.content}
								rows={4}
								required
							/>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="edit-eventStartTime">Date & Time</Label>
								<Input
									type="datetime-local"
									id="edit-eventStartTime"
									bind:value={editEvent.eventStartTime}
									required
								/>
							</div>
							<div>
								<Label for="edit-eventLocation">Location</Label>
								<Input
									type="text"
									id="edit-eventLocation"
									bind:value={editEvent.eventLocation}
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="edit-eventCapacity">Capacity (optional)</Label>
								<Input
									type="number"
									id="edit-eventCapacity"
									bind:value={editEvent.eventCapacity}
									min="1"
								/>
							</div>
							<div>
								<Label for="edit-eventPrice">Price (optional)</Label>
								<Input
									type="number"
									id="edit-eventPrice"
									bind:value={editEvent.eventPrice}
									min="0"
									step="0.01"
								/>
							</div>
						</div>

						<div>
							<Label for="edit-groupId">Group (optional)</Label>
							<Select.Root type="single" bind:value={editEvent.groupId}>
									<Select.Trigger class="w-full">
										{editEvent.groupId ?? "Select a group"}
									</Select.Trigger>
								<Select.Content>
									<Select.Item value="">No Group</Select.Item>
									{#each data.availableGroups as group}
										<Select.Item value={group.id}>{group.name} ({group.type})</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex items-center space-x-2">
								<Switch id="edit-featured" bind:checked={editEvent.featured} />
								<Label for="edit-featured">
									Featured Event
								</Label>
							</div>
							<div class="flex items-center space-x-2">
								<Switch id="edit-published" bind:checked={editEvent.published} />
								<Label for="edit-published">
									Published
								</Label>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitEditEvent}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update Event'}
					</button>
					<button
						type="button"
						onclick={() => (showEditEvent = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
