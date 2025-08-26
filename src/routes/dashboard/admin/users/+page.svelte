<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let showCreateUser = $state(false);
	let showEditUser = $state(false);
	let showAssignRole = $state(false);
	let selectedUser: any = $state(null);
	let selectedRole = $state('');
	let loading = $state(false);

	// Form data for creating new user
	let newUser = $state({
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		password: '',
		administrator: false
	});

	// Edit user data
	let editUser = $state({
		id: '',
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		administrator: false
	});

	function handleCreateUser() {
		showCreateUser = true;
		newUser = {
			email: '',
			username: '',
			firstName: '',
			lastName: '',
			password: '',
			administrator: false
		};
	}

	function handleEditUser(user: any) {
		selectedUser = user;
		editUser = {
			id: user.id,
			email: user.email,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			administrator: user.administrator
		};
		showEditUser = true;
	}

	function handleAssignRole(user: any) {
		selectedUser = user;
		selectedRole = '';
		showAssignRole = true;
	}

	async function submitCreateUser() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'create', ...newUser })
			});

			if (response.ok) {
				showCreateUser = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error creating user: ' + error);
			}
		} catch (error) {
			alert('Error creating user: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitEditUser() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'update', ...editUser })
			});

			if (response.ok) {
				showEditUser = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error updating user: ' + error);
			}
		} catch (error) {
			alert('Error updating user: ' + error);
		} finally {
			loading = false;
		}
	}

	async function submitAssignRole() {
		if (!selectedRole) return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'assign-role',
					userId: selectedUser.id,
					roleId: selectedRole
				})
			});

			if (response.ok) {
				showAssignRole = false;
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error assigning role: ' + error);
			}
		} catch (error) {
			alert('Error assigning role: ' + error);
		} finally {
			loading = false;
		}
	}

	async function removeRole(userId: string, roleId: string) {
		if (!confirm('Are you sure you want to remove this role?')) return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'remove-role',
					userId,
					roleId
				})
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error removing role: ' + error);
			}
		} catch (error) {
			alert('Error removing role: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteUser(userId: string) {
		if (!confirm('Are you sure you want to delete this user? This action cannot be undone.'))
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'delete',
					userId
				})
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				const error = await response.text();
				alert('Error deleting user: ' + error);
			}
		} catch (error) {
			alert('Error deleting user: ' + error);
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
</script>

<svelte:head>
	<title>User Management - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<HeroText
				prelude=""
				text_light_blue="User Administration"
				text=""
				subtitle="Manage chapter members, assign roles, and control access permissions."
			/>
			<!-- <h1 class="text-2xl font-semibold leading-6 text-gray-900">User Management</h1>
			<p class="mt-2 text-sm text-gray-700">
				Manage chapter members, assign roles, and control access permissions.
			</p> -->
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={handleCreateUser}
				class="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
			>
				<!-- @todo This does not work properly -->
				Add User
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
									User
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Email
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Roles
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Status
								</th>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
									Joined
								</th>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each data.users as user}
								<tr>
									<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div class="flex items-center">
											<div class="h-10 w-10 flex-shrink-0">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600"
												>
													<span class="text-sm font-medium text-white">
														{user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
													</span>
												</div>
											</div>
											<div class="ml-4">
												<div class="font-medium text-gray-900">
													{user.firstName}
													{user.lastName}
												</div>
												<div class="text-gray-500">@{user.username}</div>
											</div>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{user.email}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										<div class="flex flex-wrap gap-1">
											{#if user.administrator}
												<span
													class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20"
												>
													Administrator
												</span>
											{/if}
											{#each user.roles as role}
												<span
													class="group inline-flex cursor-pointer items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
													style="background-color: {role.color}20; color: {role.color}; border-color: {role.color}40;"
												>
													{role.name}
													<button
														onclick={() => removeRole(user.id, role.id)}
														class="ml-1 opacity-0 hover:text-red-600 group-hover:opacity-100"
													>
														×
													</button>
												</span>
											{/each}
											<button
												onclick={() => handleAssignRole(user)}
												class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100"
											>
												+ Add Role
											</button>
										</div>
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{#if user.emailVerified}
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
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
										{formatDate(user.createdAt)}
									</td>
									<td
										class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
									>
										<button
											onclick={() => handleEditUser(user)}
											class="mr-4 text-sky-600 hover:text-sky-900"
										>
											Edit
										</button>
										<button
											onclick={() => deleteUser(user.id)}
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
</div>

<!-- Create User Modal -->
{#if showCreateUser}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showCreateUser = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Create New User</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="email">Email</Label>
							<Input type="email" id="email" bind:value={newUser.email} required />
						</div>
						<div>
							<Label for="username">Username</Label>
							<Input type="text" id="username" bind:value={newUser.username} required />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="firstName">First Name</Label>
								<Input type="text" id="firstName" bind:value={newUser.firstName} required />
							</div>
							<div>
								<Label for="lastName">Last Name</Label>
								<Input type="text" id="lastName" bind:value={newUser.lastName} required />
							</div>
						</div>
						<div>
							<Label for="password">Password</Label>
							<Input type="password" id="password" bind:value={newUser.password} required />
						</div>
						<div class="flex items-center space-x-2">
							<Switch id="administrator" bind:checked={newUser.administrator} />
							<Label for="administrator">Administrator</Label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitCreateUser}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Creating...' : 'Create User'}
					</button>
					<button
						type="button"
						onclick={() => (showCreateUser = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Edit User Modal -->
{#if showEditUser}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showEditUser = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Edit User</h3>
					<div class="mt-4 space-y-4">
						<div>
							<Label for="edit-email">Email</Label>
							<Input type="email" id="edit-email" bind:value={editUser.email} required />
						</div>
						<div>
							<Label for="edit-username">Username</Label>
							<Input type="text" id="edit-username" bind:value={editUser.username} required />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="edit-firstName">First Name</Label>
								<Input type="text" id="edit-firstName" bind:value={editUser.firstName} required />
							</div>
							<div>
								<Label for="edit-lastName">Last Name</Label>
								<Input type="text" id="edit-lastName" bind:value={editUser.lastName} required />
							</div>
						</div>
						<div class="flex items-center space-x-2">
							<Switch id="edit-administrator" bind:checked={editUser.administrator} />
							<Label for="edit-administrator">Administrator</Label>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitEditUser}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Updating...' : 'Update User'}
					</button>
					<button
						type="button"
						onclick={() => (showEditUser = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Assign Role Modal -->
{#if showAssignRole}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				onclick={() => (showAssignRole = false)}
			></div>
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<div>
					<h3 class="text-lg font-semibold leading-6 text-gray-900">Assign Role</h3>
					<p class="mt-2 text-sm text-gray-500">
						Assign a role to {selectedUser?.firstName}
						{selectedUser?.lastName}
					</p>
					<div class="mt-4">
						<Label for="role-select">Select Role</Label>
						<Select.Root bind:selected={selectedRole}>
							<Select.Trigger class="w-full">
								<Select.Value placeholder="Select a role..." />
							</Select.Trigger>
							<Select.Content>
								{#each data.availableRoles as role}
									<Select.Item value={role.id}>{role.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
					<button
						type="button"
						onclick={submitAssignRole}
						disabled={loading || !selectedRole}
						class="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50 sm:col-start-2"
					>
						{loading ? 'Assigning...' : 'Assign Role'}
					</button>
					<button
						type="button"
						onclick={() => (showAssignRole = false)}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
