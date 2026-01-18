<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import { CircleCheck, TicketIcon, TriangleAlert, Users } from 'lucide-svelte';
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
			<HeroText
				prelude=""
				text_light_blue="Invite Codes"
				text=""
				subtitle="Create and manage invite codes to control chapter membership registration."
			/>
			<!-- <h1 class="text-2xl font-semibold leading-6 text-secondary">Invite Code Management</h1>
			<p class="mt-2 text-sm text-secondary/70">
				Create and manage invite codes to control chapter membership registration.
			</p> -->
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateInvite}
				class="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-background shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				Create Invite Code
			</button>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<div class="overflow-hidden rounded-lg bg-secondary shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<TicketIcon class="h-6 w-6 text-primary" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-muted/70">Total Invites</dt>
							<dd class="text-lg font-medium text-muted">{data.stats.totalInvites}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-secondary shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<CircleCheck class="h-6 w-6 text-green-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-muted/70">Active Invites</dt>
							<dd class="text-lg font-medium text-muted">{data.stats.activeInvites}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-secondary shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Users class="h-6 w-6 text-primary" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-muted/70">Total Uses</dt>
							<dd class="text-lg font-medium text-muted">{data.stats.totalUsages}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-secondary shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<TriangleAlert class="h-6 w-6 text-red-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-muted/70">Expired/Full</dt>
							<dd class="text-lg font-medium text-muted">{data.stats.expiredInvites}</dd>
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
					<table class="min-w-full divide-y divide-muted/30">
						<thead class="bg-muted">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary sm:pl-6"
								>
									Code
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
									Description
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
									Usage
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
									Status
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
									Created
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-muted/60 bg-muted/10">
							{#each data.invites as invite}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div
												class="rounded bg-gray-100 px-2 py-1 font-mono font-medium text-secondary"
											>
												{invite.code}
											</div>
											<button
												onclick={() => copyToClipboard(getInviteUrl(invite.code))}
												class="ml-2 text-xs text-primary hover:text-primary"
												title="Copy invite URL"
											>
												Copy URL
											</button>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
										{invite.description || 'No description'}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
										{invite.usageCount}{#if invite.maxUses}
											/ {invite.maxUses}{:else}
											/ ∞{/if}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
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
									<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
										<div>
											{formatDate(invite.createdAt.toJSON())}
										</div>
										{#if invite.creatorName}
											<div class="text-xs text-muted">
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
			<h3 class="mb-4 text-lg font-medium text-secondary">Recent Registrations</h3>
			<div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
				<table class="min-w-full divide-y divide-gray-300">
					<thead class="bg-muted">
						<tr>
							<th
								scope="col"
								class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary sm:pl-6"
							>
								User
							</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
								Code Used
							</th>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary">
								Registered
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-muted/20 bg-background">
						{#each data.recentRegistrations as registration}
							<tr>
								<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
									<div class="font-medium text-secondary">
										{registration.userName}
										{registration.userLastName}
									</div>
									<div class="text-secondary/80">{registration.userEmail}</div>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
									<span class="rounded bg-gray-100 px-2 py-1 font-mono text-xs">
										{registration.code}
									</span>
								</td>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary/80">
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
				class="fixed inset-0 bg-muted bg-opacity-75 transition-opacity"
				onclick={() => (showCreateInvite = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-background px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-secondary">Create New Invite Code</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="description">Description (Optional)</Label>
							<Input
								type="text"
								id="description"
								bind:value={newInvite.description}
								placeholder="e.g., New Member Recruitment - Fall 2025"
							/>
						</div>
						<div>
							<Label for="maxUses">Maximum Uses (Optional)</Label>
							<Input
								type="number"
								id="maxUses"
								bind:value={newInvite.maxUses}
								min="1"
								placeholder="Leave empty for unlimited uses"
							/>
						</div>
						<div>
							<Label for="expiresAt">Expiration Date (Optional)</Label>
							<Input
								type="datetime-local"
								id="expiresAt"
								bind:value={newInvite.expiresAt}
								min={getTomorrowDate()}
							/>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateInvite}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Invite Code'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateInvite = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-background px-3 py-2 text-sm font-semibold text-secondary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-muted sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
