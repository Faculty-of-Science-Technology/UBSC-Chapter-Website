<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let searchTerm = $state('');
	let filterRole = $state('');
	let filterGroup = $state('');
	let filterStatus = $state('');

	const filteredMembers = $derived(
		data.members.filter((member) => {
			// Search filter
			const matchesSearch =
				!searchTerm ||
				member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				member.username.toLowerCase().includes(searchTerm.toLowerCase());

			// Role filter
			const matchesRole = !filterRole || member.roles.some((role: any) => role.id === filterRole);

			// Group filter
			const matchesGroup =
				!filterGroup || member.groups.some((group: any) => group.id === filterGroup);

			// Status filter
			const matchesStatus =
				!filterStatus ||
				(filterStatus === 'verified' && member.emailVerified) ||
				(filterStatus === 'unverified' && !member.emailVerified) ||
				(filterStatus === 'admin' && member.administrator);

			return matchesSearch && matchesRole && matchesGroup && matchesStatus;
		})
	);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function clearFilters() {
		searchTerm = '';
		filterRole = '';
		filterGroup = '';
		filterStatus = '';
	}

	function exportMembers() {
		const csvContent = [
			['Name', 'Email', 'Username', 'Status', 'Roles', 'Groups', 'Joined'].join(','),
			...filteredMembers.map((member) =>
				[
					`"${member.firstName} ${member.lastName}"`,
					member.email,
					member.username,
					member.emailVerified ? 'Verified' : 'Unverified',
					`"${member.roles.map((r) => r.name).join(', ')}"`,
					`"${member.groups.map((g) => g.name).join(', ')}"`,
					formatDate(member.createdAt)
				].join(',')
			)
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `ubsc-members-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Members - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<HeroText
				prelude=""
				text_light_blue="Chapter Members"
				text=""
				subtitle="Manage chapter members, their roles, and group memberships."
			/>
			<!-- <h1 class="text-2xl font-semibold leading-6 text-secondary">Chapter Members</h1>
			<p class="mt-2 text-sm text-secondary/70">
				View and manage all chapter members, their roles, and group memberships.
			</p> -->
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={exportMembers}
				class="mr-3 inline-flex items-center rounded-md bg-background px-3 py-2 text-sm font-semibold text-secondary shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-muted"
			>
				<svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				Export CSV
			</button>
		</div>
	</div>

	<!-- Statistics Cards -->
	<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<div class="overflow-hidden rounded-lg bg-background shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg
							class="h-6 w-6 text-muted"
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
							<dt class="truncate text-sm font-medium text-secondary/80">Total Members</dt>
							<dd class="text-lg font-medium text-secondary">{data.stats.totalMembers}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-background shadow">
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
							<dt class="truncate text-sm font-medium text-secondary/80">Verified Members</dt>
							<dd class="text-lg font-medium text-secondary">{data.stats.verifiedMembers}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-background shadow">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<svg class="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-secondary/80">Administrators</dt>
							<dd class="text-lg font-medium text-secondary">{data.stats.adminMembers}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-background shadow">
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-secondary/80">New This Month</dt>
							<dd class="text-lg font-medium text-secondary">{data.stats.recentMembers}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mt-8 rounded-lg bg-background p-6 shadow">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<div>
				<Label for="search">Search</Label>
				<Input
					type="text"
					id="search"
					bind:value={searchTerm}
					placeholder="Name, email, or username..."
				/>
			</div>

			<div>
				<Label for="role-filter">Role</Label>
				<Select.Root type="single" bind:value={filterRole}>
					<Select.Trigger class="w-full">
						{#if filterRole.trim() === ''}
							All Roles
						{:else}
							{#each data.availableRoles as role}
								{#if filterRole === role.id}{role.name}{/if}
							{/each}
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Roles</Select.Item>
						{#each data.availableRoles as role}
							<Select.Item value={role.id}>{role.name}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div>
				<Label for="group-filter">Group</Label>
				<Select.Root type="single" bind:value={filterGroup}>
					<Select.Trigger class="w-full">
						{#if filterGroup.trim() === ''}
							All Groups
						{:else}
							{#each data.availableGroups as group}
								{#if filterGroup === group.id}{group.name}{/if}
							{/each}
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Groups</Select.Item>
						{#each data.availableGroups as group}
							<Select.Item value={group.id}>{group.name} ({group.type})</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div>
				<Label for="status-filter">Status</Label>
				<Select.Root type="single" bind:value={filterStatus}>
					<Select.Trigger class="w-full">
						{#if filterStatus.trim() === ''}
							All Status
						{:else}
							{filterStatus[0].toLocaleUpperCase() + filterStatus.slice(1, 99)}
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="">All Status</Select.Item>
						<Select.Item value="verified">Verified</Select.Item>
						<Select.Item value="unverified">Unverified</Select.Item>
						<Select.Item value="admin">Administrator</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-end">
				<Button onclick={clearFilters} variant="secondary" class="w-full">Clear Filters</Button>
			</div>
		</div>

		<div class="mt-4 text-sm text-secondary/80">
			Showing {filteredMembers.length} of {data.members.length} members
		</div>
	</div>

	<!-- Members Grid -->
	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredMembers as member}
			<div class="overflow-hidden rounded-lg bg-background shadow">
				<div class="p-6">
					<div class="flex items-center">
						<div class="h-12 w-12 flex-shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
								<span class="text-lg font-medium text-background">
									{member.firstName?.charAt(0) || ''}{member.lastName?.charAt(0) || ''}
								</span>
							</div>
						</div>
						<div class="ml-4 min-w-0 flex-1">
							<div class="flex items-center">
								<p class="truncate text-sm font-medium text-secondary">
									{member.firstName}
									{member.lastName}
								</p>
								{#if member.administrator}
									<span
										class="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
									>
										Admin
									</span>
								{/if}
							</div>
							<p class="truncate text-sm text-secondary/80">@{member.username}</p>
							<p class="truncate text-xs text-muted">{member.email}</p>
						</div>
					</div>

					<!-- Status -->
					<div class="mt-4">
						{#if member.emailVerified}
							<span
								class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
							>
								Verified
							</span>
						{:else}
							<span
								class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
							>
								Pending
							</span>
						{/if}
					</div>

					<!-- Roles -->
					{#if member.roles.length > 0}
						<div class="mt-3">
							<p class="mb-1 text-xs text-secondary/80">Roles:</p>
							<div class="flex flex-wrap gap-1">
								{#each member.roles as role}
									<span
										class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
										style="background-color: {role.color}20; color: {role.color}; border-color: {role.color}40;"
									>
										{role.name}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Groups -->
					{#if member.groups.length > 0}
						<div class="mt-3">
							<p class="mb-1 text-xs text-secondary/80">Groups:</p>
							<div class="flex flex-wrap gap-1">
								{#each member.groups.slice(0, 2) as group}
									<span
										class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
									>
										{group.name}
									</span>
								{/each}
								{#if member.groups.length > 2}
									<span
										class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
									>
										+{member.groups.length - 2} more
									</span>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Join Date -->
					<div class="mt-4 border-t border-muted/20 pt-3">
						<p class="text-xs text-secondary/80">
							Joined {formatDate(member.createdAt)}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredMembers.length === 0}
		<div class="mt-8 text-center">
			<svg
				class="mx-auto h-12 w-12 text-muted"
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
			<h3 class="mt-2 text-sm font-medium text-secondary">No members found</h3>
			<p class="mt-1 text-sm text-secondary/80">
				{#if searchTerm || filterRole || filterGroup || filterStatus}
					Try adjusting your search criteria or clearing the filters.
				{:else}
					No members have joined the chapter yet.
				{/if}
			</p>
		</div>
	{/if}
</div>
