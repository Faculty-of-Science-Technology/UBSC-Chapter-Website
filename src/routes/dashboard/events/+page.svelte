<script lang="ts">
	import { invalidateAll } from '$app/navigation';
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
		eventDate: '',
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
		eventDate: '',
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
			eventDate: '',
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
			eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
			eventLocation: event.eventLocation || '',
			eventCapacity: event.eventCapacity,
			eventPrice: event.eventPrice,
			groupId: event.groupId || '',
			featured: event.featured,
			published: event.published
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
		if (price === null || price === 0) return 'Free';
		return `$${price.toFixed(2)}`;
	}

	function getEventStatus(event: any) {
		const now = new Date();
		const eventDate = new Date(event.eventDate);

		if (!event.published) return { text: 'Draft', color: 'gray' };
		if (eventDate < now) return { text: 'Past', color: 'red' };
		if (eventDate > now) return { text: 'Upcoming', color: 'green' };
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
													{event.groupName || 'No Group'} • by {event.authorName}
													{event.authorLastName}
												</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div>
											<div class="font-medium text-gray-900">
												{formatDate(event.eventDate)}
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
							<label for="title" class="block text-sm font-medium text-gray-700">Event Title</label>
							<input
								type="text"
								id="title"
								bind:value={newEvent.title}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="content" class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								id="content"
								bind:value={newEvent.content}
								rows="4"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							></textarea>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="eventDate" class="block text-sm font-medium text-gray-700"
									>Date & Time</label
								>
								<input
									type="datetime-local"
									id="eventDate"
									bind:value={newEvent.eventDate}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									required
								/>
							</div>
							<div>
								<label for="eventLocation" class="block text-sm font-medium text-gray-700"
									>Location</label
								>
								<input
									type="text"
									id="eventLocation"
									bind:value={newEvent.eventLocation}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="eventCapacity" class="block text-sm font-medium text-gray-700"
									>Capacity (optional)</label
								>
								<input
									type="number"
									id="eventCapacity"
									bind:value={newEvent.eventCapacity}
									min="1"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label for="eventPrice" class="block text-sm font-medium text-gray-700"
									>Price (optional)</label
								>
								<input
									type="number"
									id="eventPrice"
									bind:value={newEvent.eventPrice}
									min="0"
									step="0.01"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label for="groupId" class="block text-sm font-medium text-gray-700"
								>Group (optional)</label
							>
							<select
								id="groupId"
								bind:value={newEvent.groupId}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="">No Group</option>
								{#each data.availableGroups as group}
									<option value={group.id}>{group.name} ({group.type})</option>
								{/each}
							</select>
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex items-center">
								<input
									type="checkbox"
									id="featured"
									bind:checked={newEvent.featured}
									class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
								<label for="featured" class="ml-2 block text-sm text-gray-700">
									Featured Event
								</label>
							</div>
							<div class="flex items-center">
								<input
									type="checkbox"
									id="published"
									bind:checked={newEvent.published}
									class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
								<label for="published" class="ml-2 block text-sm text-gray-700">
									Publish immediately
								</label>
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
							<label for="edit-title" class="block text-sm font-medium text-gray-700"
								>Event Title</label
							>
							<input
								type="text"
								id="edit-title"
								bind:value={editEvent.title}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="edit-content" class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								id="edit-content"
								bind:value={editEvent.content}
								rows="4"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							></textarea>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="edit-eventDate" class="block text-sm font-medium text-gray-700"
									>Date & Time</label
								>
								<input
									type="datetime-local"
									id="edit-eventDate"
									bind:value={editEvent.eventDate}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
									required
								/>
							</div>
							<div>
								<label for="edit-eventLocation" class="block text-sm font-medium text-gray-700"
									>Location</label
								>
								<input
									type="text"
									id="edit-eventLocation"
									bind:value={editEvent.eventLocation}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="edit-eventCapacity" class="block text-sm font-medium text-gray-700"
									>Capacity (optional)</label
								>
								<input
									type="number"
									id="edit-eventCapacity"
									bind:value={editEvent.eventCapacity}
									min="1"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label for="edit-eventPrice" class="block text-sm font-medium text-gray-700"
									>Price (optional)</label
								>
								<input
									type="number"
									id="edit-eventPrice"
									bind:value={editEvent.eventPrice}
									min="0"
									step="0.01"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
						</div>

						<div>
							<label for="edit-groupId" class="block text-sm font-medium text-gray-700"
								>Group (optional)</label
							>
							<select
								id="edit-groupId"
								bind:value={editEvent.groupId}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="">No Group</option>
								{#each data.availableGroups as group}
									<option value={group.id}>{group.name} ({group.type})</option>
								{/each}
							</select>
						</div>

						<div class="flex items-center space-x-4">
							<div class="flex items-center">
								<input
									type="checkbox"
									id="edit-featured"
									bind:checked={editEvent.featured}
									class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
								<label for="edit-featured" class="ml-2 block text-sm text-gray-700">
									Featured Event
								</label>
							</div>
							<div class="flex items-center">
								<input
									type="checkbox"
									id="edit-published"
									bind:checked={editEvent.published}
									class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								/>
								<label for="edit-published" class="ml-2 block text-sm text-gray-700">
									Published
								</label>
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
