<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreateGroup = $state(false);
	let showEditGroup = $state(false);
	let showManageMembers = $state(false);
	let selectedGroup: any = $state(null);
	let loading = $state(false);

	// Form data for creating new group
	let newGroup = $state({
		name: '',
		description: '',
		type: 'STANDARD' as 'STANDARD' | 'COMMITTEE',
		color: '#6366f1',
		isPublic: true
	});

	// Edit group data
	let editGroup = $state({
		id: '',
		name: '',
		description: '',
		type: 'STANDARD' as 'STANDARD' | 'COMMITTEE',
		color: '#6366f1',
		isPublic: true
	});

	// Member management
	let selectedMember = $state('');

	function handleCreateGroup() {
		showCreateGroup = true;
		newGroup = {
			name: '',
			description: '',
			type: 'STANDARD',
			color: '#6366f1',
			isPublic: true
		};
	}

	function handleEditGroup(group: any) {
		selectedGroup = group;
		editGroup = {
			id: group.id,
			name: group.name,
			description: group.description || '',
			type: group.type,
			color: group.color || '#6366f1',
			isPublic: group.isPublic
		};
		showEditGroup = true;
	}

	function handleManageMembers(group: any) {
		selectedGroup = group;
		selectedMember = '';
		showManageMembers = true;
	}

	async function submitCreateGroup() {
		loading = true;
		try {
			const response = await fetch('/dashboard/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'create', ...newGroup })
			});

			if (response.ok) {
				showCreateGroup = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating group: ' + error);
			}
		} catch (error) {
			alert('Error creating group: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitEditGroup() {
		loading = true;
		try {
			const response = await fetch('/dashboard/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'update', ...editGroup })
			});

			if (response.ok) {
				showEditGroup = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating group: ' + error);
			}
		} catch (error) {
			alert('Error updating group: ' + error);
		} finally {
			loading = false;
		}
	}

	async function addMember() {
		if (!selectedMember) return;

		loading = true;
		try {
			const response = await fetch('/dashboard/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'add-member',
					groupId: selectedGroup.id,
					userId: selectedMember
				})
			});

			if (response.ok) {
				selectedMember = '';
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error adding member: ' + error);
			}
		} catch (error) {
			alert('Error adding member: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteGroup(groupId: string) {
		if (!confirm('Are you sure you want to delete this group? This action cannot be undone.'))
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/groups', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', groupId })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting group: ' + error);
			}
		} catch (error) {
			alert('Error deleting group: ' + error);
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getTypeColor(type: string) {
		return type === 'COMMITTEE'
			? 'bg-purple-50 text-purple-700 ring-purple-600/20'
			: 'bg-blue-50 text-blue-700 ring-blue-600/20';
	}
</script>

<svelte:head>
	<title>Groups - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Groups</h1>
			<p class="mt-2 text-sm text-gray-700">
				Manage chapter groups, committees, and working groups.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateGroup}
				class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Create Group
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
									Group
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Type
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Members
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Visibility
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Created
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.groups as group}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div class="h-10 w-10 flex-shrink-0">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-lg font-semibold text-white"
													style="background-color: {group.color}"
												>
													{group.name.charAt(0).toUpperCase()}
												</div>
											</div>
											<div class="ml-4">
												<div class="font-medium text-gray-900">
													{group.name}
												</div>
												<div class="text-gray-500">
													{group.description || 'No description'}
												</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<span
											class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset {getTypeColor(
												group.type
											)}"
										>
											{group.type}
										</span>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div class="flex items-center">
											<span class="font-medium text-gray-900">{group.memberCount}</span>
											<button
												onclick={() => handleManageMembers(group)}
												class="ml-2 text-indigo-600 hover:text-indigo-900"
											>
												Manage
											</button>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{#if group.isPublic}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
											>
												Public
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
											>
												Private
											</span>
										{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div>
											<div>{formatDate(group.createdAt)}</div>
											<div class="text-xs text-gray-400">
												by {group.creatorName}
												{group.creatorLastName}
											</div>
										</div>
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											onclick={() => handleEditGroup(group)}
											class="mr-4 text-indigo-600 hover:text-indigo-900"
										>
											Edit
										</button>
										<button
											onclick={() => deleteGroup(group.id)}
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

<!-- Create Group Modal -->
{#if showCreateGroup}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreateGroup = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Group</h3>
					<div class="mt-4 space-y-4">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700">Group Name</label>
							<input
								type="text"
								id="name"
								bind:value={newGroup.name}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="description" class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								id="description"
								bind:value={newGroup.description}
								rows="3"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							></textarea>
						</div>

						<div>
							<label for="type" class="block text-sm font-medium text-gray-700">Group Type</label>
							<select
								id="type"
								bind:value={newGroup.type}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="STANDARD">Standard Group</option>
								<option value="COMMITTEE">Committee</option>
							</select>
						</div>

						<div>
							<label for="color" class="block text-sm font-medium text-gray-700">Group Color</label>
							<input
								type="color"
								id="color"
								bind:value={newGroup.color}
								class="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="isPublic"
								bind:checked={newGroup.isPublic}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label for="isPublic" class="ml-2 block text-sm text-gray-700">
								Public group (visible to all members)
							</label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateGroup}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Group'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateGroup = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Group Modal -->
{#if showEditGroup}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showEditGroup = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit Group</h3>
					<div class="mt-4 space-y-4">
						<div>
							<label for="edit-name" class="block text-sm font-medium text-gray-700"
								>Group Name</label
							>
							<input
								type="text"
								id="edit-name"
								bind:value={editGroup.name}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								required
							/>
						</div>

						<div>
							<label for="edit-description" class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								id="edit-description"
								bind:value={editGroup.description}
								rows="3"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							></textarea>
						</div>

						<div>
							<label for="edit-type" class="block text-sm font-medium text-gray-700"
								>Group Type</label
							>
							<select
								id="edit-type"
								bind:value={editGroup.type}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="STANDARD">Standard Group</option>
								<option value="COMMITTEE">Committee</option>
							</select>
						</div>

						<div>
							<label for="edit-color" class="block text-sm font-medium text-gray-700"
								>Group Color</label
							>
							<input
								type="color"
								id="edit-color"
								bind:value={editGroup.color}
								class="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="edit-isPublic"
								bind:checked={editGroup.isPublic}
								class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label for="edit-isPublic" class="ml-2 block text-sm text-gray-700">
								Public group (visible to all members)
							</label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitEditGroup}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update Group'}
					</button>
					<button
						type="button"
						onclick={() => (showEditGroup = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Manage Members Modal -->
{#if showManageMembers}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showManageMembers = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Manage Members</h3>
					<p class="mt-2 text-sm text-gray-500">
						Add members to {selectedGroup?.name}
					</p>
					<div class="mt-4">
						<label for="member-select" class="block text-sm font-medium text-gray-700"
							>Add Member</label
						>
						<div class="mt-1 flex space-x-2">
							<select
								id="member-select"
								bind:value={selectedMember}
								class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="">Select a member...</option>
								{#each data.availableUsers as user}
									<option value={user.id}
										>{user.firstName} {user.lastName} (@{user.username})</option
									>
								{/each}
							</select>
							<button
								type="button"
								onclick={addMember}
								disabled={loading || !selectedMember}
								class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
							>
								Add
							</button>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6">
					<button
						type="button"
						onclick={() => (showManageMembers = false)}
						class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
