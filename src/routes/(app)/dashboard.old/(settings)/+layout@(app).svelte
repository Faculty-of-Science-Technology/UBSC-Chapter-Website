<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import { Separator } from '$lib/components/vendor/ui/separator/index.js';
	import { cn } from '$lib/components/vendor/utils';
	import { NavLink, _Settings_NavLinkIndexes } from '$lib/types/Navigation';
	import {
		Calendar,
		ChevronLeft,
		Info,
		LayoutDashboard,
		LogOut,
		Menu,
		Radio,
		User,
		Users,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	
	let { children, data } = $props();
	let active_link = $state(0);
	let mobileMenuOpen = $state(false);
	const user = data.user;

	// Update active link based on URL
	function updateActiveLink() {
		const url = window.location.pathname.replace(/\//g, '-');
		active_link = NavLink(url, { repository: _Settings_NavLinkIndexes });
	}

	onMount(() => {
		updateActiveLink();
	});

	afterNavigate(() => {
		updateActiveLink();
		mobileMenuOpen = false;
	});

	// Handle keyboard shortcuts
	onMount(() => {
		async function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings');
			}
			if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings/notifications');
			}
			if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings/setup-agenda');
			}
			if (e.key === 'u' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings/manage-users');
			}
			if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings/about-system');
			}
			if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				await goto('/dashboard/settings/broadcast-manager');
			}
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="grid lg:grid-cols-5">
	<!-- Mobile header -->
	<header class="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
		<Button variant="ghost" size="icon" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
			{#if mobileMenuOpen}
				<X class="h-5 w-5" />
			{:else}
				<Menu class="h-5 w-5" />
			{/if}
			<span class="sr-only">Toggle Menu</span>
		</Button>
		<h1 class="flex-1 text-lg font-semibold">Settings</h1>
		<Button variant="ghost" size="icon" onclick={() => goto('/dashboard')}>
			<LayoutDashboard class="h-5 w-5" />
			<span class="sr-only">Dashboard</span>
		</Button>
	</header>

	<!-- Settings sidebar -->
	<aside class={`
		border-r bg-background transition-all duration-300 ease-in-out
		${mobileMenuOpen ? 'fixed inset-y-0 z-50 block w-72 border-r' : 'hidden lg:block'}
		lg:sticky lg:top-0 lg:h-screen
	`}>
		<div class="flex h-full flex-col gap-2 py-6">
			<div class="px-6">
				<a href="/dashboard" class="flex items-center gap-2">
					<ChevronLeft class="h-4 w-4" />
					<span class="text-sm font-medium">Back to Dashboard</span>
				</a>
				<h2 class="mt-4 text-lg font-semibold">Settings</h2>
				<p class="text-sm text-muted-foreground">Manage your account settings</p>
			</div>
			
			<Separator class="my-2" />
			
			<div class="flex-1 overflow-auto py-2">
				<nav class="grid gap-1 px-2">
					<!-- Account settings -->
					<a 
						href="/dashboard/settings" 
						class={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
							active_link === 0 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
						)}
					>
						<User class="h-4 w-4" />
						<span>Your Profile</span>
						<span class="ml-auto text-xs text-muted-foreground">⌘P</span>
					</a>
					
					<!-- <a 
						href="/dashboard/settings/notifications" 
						class={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
							active_link === 1 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
						)}
					>
						<Bell class="h-4 w-4" />
						<span>Notifications</span>
						<span class="ml-auto text-xs text-muted-foreground">⌘M</span>
					</a> -->
					
					{#if user.AccountType === 'owner'}
						<Separator class="my-2" />
						<div class="px-3 py-2">
							<h3 class="mb-1 text-xs font-medium text-muted-foreground">Administrative Tools</h3>
						</div>
						
						<a 
							href="/dashboard/settings/setup-agenda" 
							class={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
								active_link === 2 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
							)}
						>
							<Calendar class="h-4 w-4" />
							<span>Manage Agenda</span>
							<span class="ml-auto text-xs text-muted-foreground">⌘F</span>
						</a>
						
						<a 
							href="/dashboard/settings/broadcast-manager" 
							class={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
								active_link === 6 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
							)}
						>
							<Radio class="h-4 w-4" />
							<span>Broadcast Management</span>
							<span class="ml-auto text-xs text-muted-foreground">⌘L</span>
						</a>
						
						<a 
							href="/dashboard/settings/manage-users" 
							class={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
								active_link === 3 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
							)}
						>
							<Users class="h-4 w-4" />
							<span>Manage Users</span>
							<span class="ml-auto text-xs text-muted-foreground">⌘U</span>
						</a>
					{/if}
					
					<a 
						href="/dashboard/settings/about-system" 
						class={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground", 
							active_link === 5 ? "bg-accent text-accent-foreground" : "text-muted-foreground"
						)}
					>
						<Info class="h-4 w-4" />
						<span>About System</span>
						<span class="ml-auto text-xs text-muted-foreground">⌘G</span>
					</a>
				</nav>
			</div>
			
			<Separator class="my-2" />
			
			<div class="px-4 py-2">
				<a href="/auth/logout" data-sveltekit-reload>
					<Button variant="ghost" size="sm" class="w-full justify-start text-muted-foreground">
						<LogOut class="mr-2 h-4 w-4" />
						Log out
					</Button>
				</a>
			</div>
		</div>
	</aside>

	<!-- Main content -->
	<main class="col-span-4 min-h-screen overflow-y-auto bg-slate-50 pb-12">
		<div class="container max-w-4xl py-6 lg:py-10">
			{@render children?.()}
		</div>
	</main>
</div>
