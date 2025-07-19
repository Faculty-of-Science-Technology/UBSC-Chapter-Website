<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreateInvite = $state(false);
	let loading = $state(false);

	// Form data for creating new invite
	let newInvite = $state({
		description: '',
		maxUses: '',
		expiresAt: ''
	});

	function handleCreateInvite() {
		showCreateInvite = true;
		newInvite = {
			description: '',
			maxUses: '',
			expiresAt: ''
		};
	}

	async function submitCreateInvite() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/invites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'create',
					...newInvite,
					maxUses: newInvite.maxUses ? parseInt(newInvite.maxUses) : null
				})
			});

			if (response.ok) {
				showCreateInvite = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating invite: ' + error);
			}
		} catch (error) {
			alert('Error creating invite: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteInvite(inviteId: string) {
		if (!confirm('Are you sure you want to delete this invite code?')) return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/invites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', inviteId })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting invite: ' + error);
			}
		} catch (error) {
			alert('Error deleting invite: ' + error);
		} finally {
			loading = false;
		}
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			alert('Copied to clipboard!');
		});
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

	function getInviteStatus(invite: any) {
		const now = new Date();
		const isExpired = invite.expiresAt && new Date(invite.expiresAt) < now;
		const isMaxedOut = invite.maxUses && invite.usageCount >= invite.maxUses;

		if (isExpired) return { label: 'Expired', color: 'red' };
		if (isMaxedOut) return { label: 'Max Uses Reached', color: 'red' };
		return { label: 'Active', color: 'green' };
	}

	function getInviteUrl(code: string) {
		return `${window.location.origin}/auth/register?invite=${code}`;
	}

	function getTomorrowDate() {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().slice(0, 16);
	}
</script>

<svelte:head>
	<title>Invite Code Management - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Invite Code Management</h1>
			<p class="mt-2 text-sm text-gray-700">
				Create and manage invite codes to control chapter membership registration.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateInvite}
				class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Create Invite Code
			</button>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-2-4V7a2 2 0 00-2-2H5z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Invites</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.totalInvites}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-green-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Active Invites</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.activeInvites}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-blue-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Uses</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.totalUsages}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-white shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Expired/Full</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.expiredInvites}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Invite Codes Table -->
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
									Code
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Description
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Usage
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Status
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
							{#each data.invites as invite}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div
												class="rounded bg-gray-100 px-2 py-1 font-mono font-medium text-gray-900"
											>
												{invite.code}
											</div>
											<button
												onclick={() => copyToClipboard(getInviteUrl(invite.code))}
												class="ml-2 text-xs text-indigo-600 hover:text-indigo-900"
												title="Copy invite URL"
											>
												Copy URL
											</button>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{invite.description || 'No description'}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{invite.usageCount}{#if invite.maxUses}
											/ {invite.maxUses}{:else}
											/ ∞{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{#if getInviteStatus(invite).color === 'green'}
											<span
												class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
											>
												{getInviteStatus(invite).label}
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
											>
												{getInviteStatus(invite).label}
											</span>
										{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div>
											{formatDate(invite.createdAt.toJSON())}
										</div>
										{#if invite.creatorName}
											<div class="text-xs text-gray-400">
												by {invite.creatorName}
												{invite.creatorLastName}
											</div>
										{/if}
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											onclick={() => deleteInvite(invite.id)}
											class="text-red-600 hover:text-red-900"
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

	<!-- Recent Registrations -->
	{#if data.recentRegistrations.length > 0}
		<div class="mt-8">
			<h3 class="mb-4 text-lg font-medium text-gray-900">Recent Registrations</h3>
			<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
				<table class="min-w-full divide-y divide-gray-300">
					<thead class="bg-gray-50">
						<tr>
							<th
								scope="col"
								class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
							>
								User
							</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Code Used
							</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
								Registered
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each data.recentRegistrations as registration}
							<tr>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
									<div class="font-medium text-gray-900">
										{registration.userName}
										{registration.userLastName}
									</div>
									<div class="text-gray-500">{registration.userEmail}</div>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<span class="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
										{registration.code}
									</span>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									{formatDate(registration.usedAt.toJSON())}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Create Invite Modal -->
{#if showCreateInvite}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreateInvite = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Invite Code</h3>
					<div class="mt-4 space-y-4">
						<div>
							<label for="description" class="block text-sm font-medium text-gray-700"
								>Description (Optional)</label
							>
							<input
								type="text"
								id="description"
								bind:value={newInvite.description}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="e.g., New Member Recruitment - Fall 2025"
							/>
						</div>
						<div>
							<label for="maxUses" class="block text-sm font-medium text-gray-700"
								>Maximum Uses (Optional)</label
							>
							<input
								type="number"
								id="maxUses"
								bind:value={newInvite.maxUses}
								min="1"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								placeholder="Leave empty for unlimited uses"
							/>
						</div>
						<div>
							<label for="expiresAt" class="block text-sm font-medium text-gray-700"
								>Expiration Date (Optional)</label
							>
							<input
								type="datetime-local"
								id="expiresAt"
								bind:value={newInvite.expiresAt}
								min={getTomorrowDate()}
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateInvite}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Invite Code'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateInvite = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
