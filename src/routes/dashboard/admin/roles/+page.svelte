<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import type { PageData } from './$types';

	// @todo Fix this page Add/Edit
	export let data: PageData;

	let showCreateRole = false;
	let showEditRole = false;
	let selectedRole: any = null;
	let loading = false;

	// Form data for creating new role
	let newRole = {
		name: '',
		description: '',
		type: { value: 'MEMBER', label: 'Member' },
		color: '#6366f1',
		canManageUsers: false,
		canManageRoles: false,
		canManageEvents: false,
		canManagePosts: false,
		canEditOthersPosts: false,
		canManageGroups: false,
		canManageInvites: false,
		canManageTheme: false
	};

	// Edit role data
	let editRole = {
		id: '',
		name: '',
		description: '',
		type: { value: 'MEMBER', label: 'Member' },
		color: '#6366f1',
		canManageUsers: false,
		canManageRoles: false,
		canManageEvents: false,
		canManagePosts: false,
		canEditOthersPosts: false,
		canManageGroups: false,
		canManageInvites: false,
		canManageTheme: false
	};

	const permissions = [
		{
			key: 'canManageUsers',
			label: 'Manage Users',
			description: 'Create, edit, and delete user accounts'
		},
		{
			key: 'canManageRoles',
			label: 'Manage Roles',
			description: 'Create and modify user roles and permissions'
		},
		{
			key: 'canManageEvents',
			label: 'Manage Events',
			description: 'Create, edit, and delete events'
		},
		{
			key: 'canManagePosts',
			label: 'Manage Blog Posts',
			description: 'Create, edit, and delete blog posts'
		},
		{
			key: 'canEditOthersPosts',
			label: "Edit Others' Posts",
			description: 'Edit and delete posts created by other users'
		},
		{
			key: 'canManageGroups',
			label: 'Manage Groups',
			description: 'Create and manage chapter groups'
		},
		{
			key: 'canManageInvites',
			label: 'Manage Invites',
			description: 'Create and manage invite codes'
		},
		{
			key: 'canManageTheme',
			label: 'Manage Theme',
			description: 'Customize website appearance and colors'
		}
	];

	const roleTypes = [
		{ value: 'ADMIN', label: 'Administrator' },
		{ value: 'MODERATOR', label: 'Moderator' },
		{ value: 'EVENT_MANAGER', label: 'Event Manager' },
		{ value: 'USER_MANAGER', label: 'User Manager' },
		{ value: 'CONTENT_MANAGER', label: 'Content Manager' },
		{ value: 'MEMBER', label: 'Member' }
	];

	function handleCreateRole() {
		showCreateRole = true;
		newRole = {
			name: '',
			description: '',
			type: { value: 'MEMBER', label: 'Member' },
			canManageUsers: false,
			canManageRoles: false,
			canManageEvents: false,
			canManagePosts: false,
			canEditOthersPosts: false,
			canManageGroups: false,
			canManageInvites: false,
			canManageTheme: false
		};
	}

	function handleEditRole(role: any) {
		selectedRole = role;
		editRole = {
			id: role.id,
			name: role.name,
			description: role.description,
			type: roleTypes.find(rt => rt.value === role.type) || { value: 'MEMBER', label: 'Member' },
			color: role.color || '#0284c7',
			canManageUsers: role.canManageUsers,
			canManageRoles: role.canManageRoles,
			canManageEvents: role.canManageEvents,
			canManagePosts: role.canManagePosts,
			canEditOthersPosts: role.canEditOthersPosts,
			canManageGroups: role.canManageGroups,
			canManageInvites: role.canManageInvites,
			canManageTheme: role.canManageTheme
		};
		showEditRole = true;
	}

	async function submitCreateRole() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/roles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'create', 
					name: newRole.name,
					description: newRole.description,
					type: newRole.type.value,
					color: newRole.color,
					canManageUsers: newRole.canManageUsers,
					canManageRoles: newRole.canManageRoles,
					canManageEvents: newRole.canManageEvents,
					canManagePosts: newRole.canManagePosts,
					canEditOthersPosts: newRole.canEditOthersPosts,
					canManageGroups: newRole.canManageGroups,
					canManageInvites: newRole.canManageInvites,
					canManageTheme: newRole.canManageTheme
				})
			});

			if (response.ok) {
				showCreateRole = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating role: ' + error);
			}
		} catch (error) {
			alert('Error creating role: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitEditRole() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/roles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					action: 'update', 
					id: editRole.id,
					name: editRole.name,
					description: editRole.description,
					type: editRole.type.value,
					color: editRole.color,
					canManageUsers: editRole.canManageUsers,
					canManageRoles: editRole.canManageRoles,
					canManageEvents: editRole.canManageEvents,
					canManagePosts: editRole.canManagePosts,
					canEditOthersPosts: editRole.canEditOthersPosts,
					canManageGroups: editRole.canManageGroups,
					canManageInvites: editRole.canManageInvites,
					canManageTheme: editRole.canManageTheme
				})
			});

			if (response.ok) {
				showEditRole = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating role: ' + error);
			}
		} catch (error) {
			alert('Error updating role: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteRole(roleId: string) {
		if (!confirm('Are you sure you want to delete this role? This will remove it from all users.'))
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/roles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', roleId })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting role: ' + error);
			}
		} catch (error) {
			alert('Error deleting role: ' + error);
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

	function getPermissionCount(role: any) {
		return permissions.filter((perm) => role[perm.key]).length;
	}
</script>

<svelte:head>
	<title>Role Management - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<HeroText
				prelude=""
				text_light_blue="Role Management"
				text=""
				subtitle="Create and manage user roles with granular permissions to control access to different features."
			/>
			<!-- <h1 class="text-2xl font-semibold leading-6 text-gray-900">Role Management</h1>
			<p class="mt-2 text-sm text-gray-700">
				Create and manage user roles with granular permissions to control access to different
				features.
			</p> -->
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateRole}
				class="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
			>
				Create Role
			</button>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.roles as role}
			<div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<div
							class="mr-3 flex h-8 w-8 items-center justify-center rounded-full"
							style="background-color: {role.color}20;"
						>
							<span class="text-sm font-medium" style="color: {role.color};">
								{role.name.charAt(0).toUpperCase()}
							</span>
						</div>
						<div>
							<h3 class="truncate text-lg font-medium text-gray-900">{role.name}</h3>
							<p class="text-sm text-gray-500">{role.type}</p>
						</div>
					</div>
					<div class="flex space-x-2">
						<button
							onclick={() => handleEditRole(role)}
							class="text-sm text-sky-600 hover:text-sky-900"
						>
							Edit
						</button>
						<button
							onclick={() => deleteRole(role.id)}
							class="text-sm text-red-600 hover:text-red-900"
						>
							Delete
						</button>
					</div>
				</div>

				<p class="mt-2 line-clamp-2 text-sm text-gray-500">
					{role.description || 'No description provided'}
				</p>

				<div class="mt-4 flex items-center justify-between text-sm text-gray-500">
					<span>{role.userCount} {role.userCount === 1 ? 'user' : 'users'}</span>
					<span>{getPermissionCount(role)} permissions</span>
				</div>

				<div class="mt-3">
					<div class="text-xs text-gray-400">Permissions:</div>
					<div class="mt-1 flex flex-wrap gap-1">
						{#each permissions.slice(0, 4) as perm}
							{#if role[perm.key]}
								<span
									class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
								>
									{perm.label}
								</span>
							{/if}
						{/each}
						{#if getPermissionCount(role) > 4}
							<span
								class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20"
							>
								+{getPermissionCount(role) - 4} more
							</span>
						{/if}
					</div>
				</div>

				<div class="mt-3 text-xs text-gray-400">
					Created {formatDate(role.createdAt.toJSON())}
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Create Role Modal -->
{#if showCreateRole}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreateRole = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New Role</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="name">Role Name</Label>
							<Input
								type="text"
								id="name"
								bind:value={newRole.name}
								placeholder="e.g., Moderator"
								required
							/>
						</div>
						<div>
							<Label for="type">Role Type</Label>
							<Select.Root bind:selected={newRole.type}>
								<Select.Trigger class="w-full">
									{newRole.type?.label || 'Select a role type'}
								</Select.Trigger>
								<Select.Content>
									{#each roleTypes as roleType}
										<Select.Item value={roleType}>{roleType.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div>
							<Label for="color">Role Color</Label>
							<Input type="color" id="color" bind:value={newRole.color} class="h-10" />
						</div>
						<div>
							<Label for="description">Description</Label>
							<Textarea
								id="description"
								bind:value={newRole.description}
								rows={3}
								placeholder="Describe what this role is for..."
							/>
						</div>
						<div>
							<div class="mb-3 text-sm font-medium text-gray-700">Permissions</div>
							<div class="space-y-3">
								{#each permissions as perm}
									<div class="flex items-start space-x-3">
										<Switch id="perm-{perm.key}" bind:checked={newRole[perm.key]} />
										<div class="text-sm">
											<Label for="perm-{perm.key}" class="font-medium text-gray-700"
												>{perm.label}</Label
											>
											<p class="text-gray-500">{perm.description}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateRole}
						disabled={loading || !newRole.name}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create Role'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateRole = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit Role Modal -->
{#if showEditRole}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showEditRole = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit Role</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="edit-name">Role Name</Label>
							<Input type="text" id="edit-name" bind:value={editRole.name} required />
						</div>
						<div>
							<Label for="edit-type">Role Type</Label>
							<Select.Root bind:selected={editRole.type}>
								<Select.Trigger class="w-full">
									{editRole.type?.label || 'Select a role type'}
								</Select.Trigger>
								<Select.Content>
									{#each roleTypes as roleType}
										<Select.Item value={roleType}>{roleType.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div>
							<Label for="edit-color">Role Color</Label>
							<Input type="color" id="edit-color" bind:value={editRole.color} class="h-10" />
						</div>
						<div>
							<Label for="edit-description">Description</Label>
							<Textarea id="edit-description" bind:value={editRole.description} rows={3} />
						</div>
						<div>
							<div class="mb-3 text-sm font-medium text-gray-700">Permissions</div>
							<div class="space-y-3">
								{#each permissions as perm}
									<div class="flex items-start space-x-3">
										<Switch id="edit-perm-{perm.key}" bind:checked={editRole[perm.key]} />
										<div class="text-sm">
											<Label for="edit-perm-{perm.key}" class="font-medium text-gray-700"
												>{perm.label}</Label
											>
											<p class="text-gray-500">{perm.description}</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitEditRole}
						disabled={loading || !editRole.name}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update Role'}
					</button>
					<button
						type="button"
						onclick={() => (showEditRole = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
