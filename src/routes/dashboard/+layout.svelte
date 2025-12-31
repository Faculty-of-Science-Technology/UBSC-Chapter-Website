<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Logo from '$lib/components/global/branding/logo.svelte';
	import {
		Calendar,
		FileText,
		Group,
		Home,
		Paintbrush,
		Shield,
		Ticket,
		UserCog,
		Users
	} from 'lucide-svelte';
	import type { Component } from 'svelte';
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

	function getIconPath(iconName: string): Component {
		const icons = {
			home: Home,
			calendar: Calendar,
			document: FileText,
			users: Users,
			'user-group': Group,
			'user-cog': UserCog,
			shield: Shield,
			ticket: Ticket,
			paint: Paintbrush
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

<div class="flex min-h-screen bg-muted">
	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<div class="fixed inset-0 z-40 lg:hidden">
			<div class="fixed inset-0 bg-muted/50" onclick={() => (sidebarOpen = false)}></div>
		</div>
	{/if}

	<!-- Sidebar -->
	<div
		class="fixed inset-y-0 left-0 z-50 w-64 transform bg-secondary shadow-lg transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0 {sidebarOpen
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0"
	>
		<div class="flex h-16 items-center justify-between border-b border-muted/20 px-6">
			<div class="flex items-center">
				<div class="mx-auto flex h-fit w-full items-center justify-center">
					<a href="/dashboard">
						<Logo mode="dark" size="sm" />
					</a>
				</div>
			</div>
			<button class="lg:hidden" onclick={() => (sidebarOpen = false)}>
				<svg class="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
							? 'bg-primary text-muted'
							: 'text-muted hover:bg-muted/20 hover:text-muted'}"
					>
						<!-- svelte-ignore svelte_component_deprecated -->
						<svelte:component
							this={getIconPath(item.icon)}
							class="mr-3 h-5 w-5 {item.current
								? 'text-primary'
								: 'text-primary group-hover:text-primary/80'}"
						/>
						{item.name}
					</a>
				{/each}
			</div>

			{#if isAdminUser()}
				<div class="mt-8">
					<h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-muted">
						Administration
					</h3>
					<div class="mt-2 space-y-1">
						{#each adminNavigation as item}
							<a
								href={item.href}
								class="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted
							transition-colors hover:bg-muted/20 hover:text-muted"
							>
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component
									this={getIconPath(item.icon)}
									class="mr-3 h-5 w-5 text-primary group-hover:text-primary/80"
								/>

								{item.name}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</nav>

		<!-- User info -->
		<div class="absolute bottom-0 w-full border-t border-muted/20 p-4">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
					<span class="text-sm font-medium text-background">
						{data.user?.FirstName?.[0] || 'U'}{data.user?.LastName?.[0] || 'S'}
					</span>
				</div>
				<div class="ml-3 min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-muted">
						{data.user?.FirstName}
						{data.user?.LastName}
					</p>
					<p class="truncate text-xs text-muted/80">
						@{data.user?.Username}
					</p>
				</div>
				<button
					onclick={handleLogout}
					class="ml-2 p-1 text-muted transition-colors hover:text-gray-600"
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
		<div class="sticky top-0 z-10 border-b border-muted bg-background px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<button class="lg:hidden" onclick={() => (sidebarOpen = true)}>
					<svg
						class="h-6 w-6 text-secondary/80"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
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
					<div class="text-sm text-secondary/80">
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
		<main class="h-full flex-1">
			<div class="h-fit overflow-clip py-8">
				{@render props?.children()}
			</div>
		</main>
	</div>
</div>
