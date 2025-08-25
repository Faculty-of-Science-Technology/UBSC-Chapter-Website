<script lang="ts">
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
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Chapter Members</h1>
			<p class="mt-2 text-sm text-gray-700">
				View and manage all chapter members, their roles, and group memberships.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={exportMembers}
				class="mr-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">Total Members</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.totalMembers}</dd>
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
							<dt class="truncate text-sm font-medium text-gray-500">Verified Members</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.verifiedMembers}</dd>
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
							class="h-6 w-6 text-indigo-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
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
							<dt class="truncate text-sm font-medium text-gray-500">Administrators</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.adminMembers}</dd>
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
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="truncate text-sm font-medium text-gray-500">New This Month</dt>
							<dd class="text-lg font-medium text-gray-900">{data.stats.recentMembers}</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mt-8 rounded-lg bg-white p-6 shadow">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			<div>
				<label for="search" class="block text-sm font-medium text-gray-700">Search</label>
				<input
					type="text"
					id="search"
					bind:value={searchTerm}
					placeholder="Name, email, or username..."
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				/>
			</div>

			<div>
				<label for="role-filter" class="block text-sm font-medium text-gray-700">Role</label>
				<select
					id="role-filter"
					bind:value={filterRole}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					<option value="">All Roles</option>
					{#each data.availableRoles as role}
						<option value={role.id}>{role.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="group-filter" class="block text-sm font-medium text-gray-700">Group</label>
				<select
					id="group-filter"
					bind:value={filterGroup}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					<option value="">All Groups</option>
					{#each data.availableGroups as group}
						<option value={group.id}>{group.name} ({group.type})</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="status-filter" class="block text-sm font-medium text-gray-700">Status</label>
				<select
					id="status-filter"
					bind:value={filterStatus}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					<option value="">All Status</option>
					<option value="verified">Verified</option>
					<option value="unverified">Unverified</option>
					<option value="admin">Administrator</option>
				</select>
			</div>

			<div class="flex items-end">
				<button
					type="button"
					onclick={clearFilters}
					class="w-full rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
				>
					Clear Filters
				</button>
			</div>
		</div>

		<div class="mt-4 text-sm text-gray-500">
			Showing {filteredMembers.length} of {data.members.length} members
		</div>
	</div>

	<!-- Members Grid -->
	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredMembers as member}
			<div class="overflow-hidden rounded-lg bg-white shadow">
				<div class="p-6">
					<div class="flex items-center">
						<div class="h-12 w-12 flex-shrink-0">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600">
								<span class="text-lg font-medium text-white">
									{member.firstName?.charAt(0) || ''}{member.lastName?.charAt(0) || ''}
								</span>
							</div>
						</div>
						<div class="ml-4 min-w-0 flex-1">
							<div class="flex items-center">
								<p class="truncate text-sm font-medium text-gray-900">
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
							<p class="truncate text-sm text-gray-500">@{member.username}</p>
							<p class="truncate text-xs text-gray-400">{member.email}</p>
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
							<p class="mb-1 text-xs text-gray-500">Roles:</p>
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
							<p class="mb-1 text-xs text-gray-500">Groups:</p>
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
										class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
									>
										+{member.groups.length - 2} more
									</span>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Join Date -->
					<div class="mt-4 border-t border-gray-200 pt-3">
						<p class="text-xs text-gray-500">
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
				class="mx-auto h-12 w-12 text-gray-400"
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
			<h3 class="mt-2 text-sm font-medium text-gray-900">No members found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{#if searchTerm || filterRole || filterGroup || filterStatus}
					Try adjusting your search criteria or clearing the filters.
				{:else}
					No members have joined the chapter yet.
				{/if}
			</p>
		</div>
	{/if}
</div>
