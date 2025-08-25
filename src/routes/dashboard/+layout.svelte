<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	const props: PageProps = $props();
	const { data } = props;

	let sidebarOpen = $state(false);

	const navigation = [
		{ name: 'Overview', href: '/dashboard', icon: 'home', current: false },
		{ name: 'Events', href: '/dashboard/events', icon: 'calendar', current: false },
		{ name: 'Blog Posts', href: '/dashboard/posts', icon: 'document', current: false },
		{ name: 'Groups', href: '/dashboard/groups', icon: 'users', current: false },
		{ name: 'Members', href: '/dashboard/members', icon: 'user-group', current: false }
	];

	const adminNavigation = [
		{ name: 'User Management', href: '/dashboard/admin/users', icon: 'user-cog' },
		{ name: 'Role Management', href: '/dashboard/admin/roles', icon: 'shield' },
		{ name: 'Invite Codes', href: '/dashboard/admin/invites', icon: 'ticket' },
		{ name: 'Theme Settings', href: '/dashboard/admin/theme', icon: 'paint' }
	];

	// Update current navigation item based on current page
	$effect(() => {
		navigation.forEach((item) => {
			item.current =
				page.url.pathname === item.href ||
				(page.url.pathname.startsWith(item.href) && item.href !== '/dashboard');
		});
	});

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			goto('/auth/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function getIconPath(iconName: string): string {
		const icons = {
			home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			calendar:
				'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			document:
				'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
			users:
				'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
			'user-group':
				'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			'user-cog':
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
			shield:
				'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			ticket:
				'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-2-4V7a2 2 0 00-2-2H5z',
			paint:
				'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v16c0 1.1.9 2 2 2s2-.9 2-2V3zM15 3v18l4-4V7l-4-4z'
		};
		return icons[iconName] || icons.home;
	}

	function isAdminUser(): boolean {
		return (
			data.user?.Administrator ||
			data.user?.Permissions.CanManageUsers ||
			data.user?.Permissions.CanManageRoles ||
			data.user?.Permissions.CanManageInvites ||
			data.user?.Permissions.CanManageTheme ||
			false
		);
	}
</script>

<svelte:head>
	<title>Dashboard - UBSC Chapter</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50">
	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<div class="fixed inset-0 z-40 lg:hidden">
			<div
				class="fixed inset-0 bg-gray-600 bg-opacity-75"
				onclick={() => (sidebarOpen = false)}
			></div>
		</div>
	{/if}

	<!-- Sidebar -->
	<div
		class="fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0"
	>
		<div class="flex h-16 items-center justify-between border-b border-gray-200 px-6">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
					<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
						/>
					</svg>
				</div>
				<span class="ml-2 text-lg font-semibold text-gray-900">UBSC</span>
			</div>
			<button class="lg:hidden" onclick={() => (sidebarOpen = false)}>
				<svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<nav class="mt-6 px-3">
			<div class="space-y-1">
				{#each navigation as item}
					<a
						href={item.href}
						class="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors {item.current
							? 'bg-indigo-100 text-indigo-900'
							: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
					>
						<svg
							class="mr-3 h-5 w-5 {item.current
								? 'text-indigo-500'
								: 'text-gray-400 group-hover:text-gray-500'}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={getIconPath(item.icon)}
							/>
						</svg>
						{item.name}
					</a>
				{/each}
			</div>

			{#if isAdminUser()}
				<div class="mt-8">
					<h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
						Administration
					</h3>
					<div class="mt-2 space-y-1">
						{#each adminNavigation as item}
							<a
								href={item.href}
								class="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
							>
								<svg
									class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d={getIconPath(item.icon)}
									/>
								</svg>
								{item.name}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</nav>

		<!-- User info -->
		<div class="absolute bottom-0 w-full border-t border-gray-200 p-4">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
					<span class="text-sm font-medium text-white">
						{data.user?.FirstName?.[0] || 'U'}{data.user?.LastName?.[0] || 'S'}
					</span>
				</div>
				<div class="ml-3 min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-gray-900">
						{data.user?.FirstName}
						{data.user?.LastName}
					</p>
					<p class="truncate text-xs text-gray-500">
						@{data.user?.Username}
					</p>
				</div>
				<button
					onclick={handleLogout}
					class="ml-2 p-1 text-gray-400 transition-colors hover:text-gray-600"
					title="Logout"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="w-full">
		<!-- Top bar -->
		<div class="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<button class="lg:hidden" onclick={() => (sidebarOpen = true)}>
					<svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>

				<div class="min-w-0 flex-1">
					<!-- Page title will be set by individual pages -->
				</div>

				<div class="flex items-center space-x-4">
					<!-- Notifications or other top bar items can go here -->
					<div class="text-sm text-gray-500">
						{#if data.user?.Roles?.length}
							{data.user.Roles.join(', ')}
						{:else}
							Member
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Page content -->
		<main class="flex-1 h-full">
			<div class="py-8 h-fit overflow-clip">
				{@render props?.children()}
			</div>
		</main>
	</div>
</div>
