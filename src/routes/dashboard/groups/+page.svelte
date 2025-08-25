<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreateGroup = $state(false);
	let showEditGroup = $state(false);
	let showManageMembers = $state(false);
	let selectedGroup: any = $state(null);
	let loading = $state(false);

	// Form data for creating new group
	let newGroup = $state({
		title: '',
		description: '',
		type: 'STANDARD' as 'STANDARD' | 'COMMITTEE'
	});

	// Edit group data
	let editGroup = $state({
		id: '',
		title: '',
		description: '',
		type: 'STANDARD' as 'STANDARD' | 'COMMITTEE'
	});

	// Member management
	let selectedMember = $state('');

	function handleCreateGroup() {
		showCreateGroup = true;
		newGroup = {
			title: '',
			description: '',
			type: 'STANDARD'
		};
	}

	function handleEditGroup(group: any) {
		selectedGroup = group;
		editGroup = {
			id: group.id,
			title: group.title,
			description: group.description || '',
			type: group.type
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
										<div>
											<div>{formatDate(group.createdAt.toJSON())}</div>
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
							<Label for="title">Group Name</Label>
							<Input type="text" id="title" bind:value={newGroup.title} required />
						</div>

						<div>
							<Label for="description">Description</Label>
							<Textarea id="description" bind:value={newGroup.description} rows={3} />
						</div>

						<div>
							<Label for="type">Group Type</Label>
							<Select.Root type="single" bind:value={newGroup.type}>
								<Select.Trigger class="w-full">
									{newGroup.type ?? 'Select group type'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="STANDARD">Standard Group</Select.Item>
									<Select.Item value="COMMITTEE">Committee</Select.Item>
								</Select.Content>
							</Select.Root>
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
							<Label for="edit-title">Group Name</Label>
							<Input type="text" id="edit-title" bind:value={editGroup.title} required />
						</div>

						<div>
							<Label for="edit-description">Description</Label>
							<Textarea id="edit-description" bind:value={editGroup.description} rows={3} />
						</div>

						<div>
							<Label for="edit-type">Group Type</Label>
							<Select.Root type="single" bind:value={editGroup.type}>
								<Select.Trigger class="w-full">
									{editGroup.type ?? 'Select group type'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="STANDARD">Standard Group</Select.Item>
									<Select.Item value="COMMITTEE">Committee</Select.Item>
								</Select.Content>
							</Select.Root>
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
						<Label for="member-select">Add Member</Label>
						<div class="mt-1 flex space-x-2">
							<Select.Root type="single" bind:value={selectedMember}>
								<Select.Trigger class="w-full">
									{#if selectedMember.trim() === ''}
										Select a member...
									{/if}
									{#each data.availableUsers as user}
										{#if selectedMember === user.id}
											{`${user.firstName} ${user.lastName} (@${user.username})`}
										{/if}
									{/each}
								</Select.Trigger>
								<Select.Content>
									{#each data.availableUsers as user}
										<Select.Item value={user.id}>
											{user.firstName}
											{user.lastName} (@{user.username})
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
							<Button
								onclick={addMember}
								disabled={loading || !selectedMember}
								class="flex-shrink-0"
							>
								Add
							</Button>
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
