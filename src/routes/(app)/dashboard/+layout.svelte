<script lang="ts">
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import { Separator } from '$lib/components/vendor/ui/separator';
	import { NavLink } from '$lib/types/Navigation';
	import type { OnNavigate } from '@sveltejs/kit';
	import {
		Briefcase,
		ChevronLeft,
		ChevronRight,
		FileText,
		Home,
		Menu,
		PlusCircle,
		Search,
		Settings,
		User,
		UserPlus,
		UserSearch,
		X
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	
	const { data, children: please } = $props();
	const { user } = data;
	let active_link = $state(0);
	let sidebarCollapsed = $state(false);
	let mobileMenuOpen = $state(false);
		let loadingBar: HTMLDivElement;

	// Update active link based on current URL
	function updateActiveLink() {
		const url = window.location.pathname.replace(/\//g, '-');
		active_link = NavLink(url);
	}

	onMount(() => {
		updateActiveLink();
		// Check if user prefers collapsed sidebar from localStorage
		const savedState = localStorage.getItem('sidebarCollapsed');
		if (savedState !== null) {
			sidebarCollapsed = JSON.parse(savedState);
		}
	});


	// Toggle sidebar collapsed state
	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
		localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
	}

	
		function delayNavigation(navigation: OnNavigate) {
		if (!document.startViewTransition) return new Promise((res) => setTimeout(res, 500));

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve(void 0);
				await navigation.complete;
			});
		});
	}

	afterNavigate(() => {
		updateActiveLink();
		mobileMenuOpen = false;
	});

		onNavigate(async (navigation) => {
		// do some work immediately before the navigation completes

		// optionally return a promise to delay navigation until it resolves
		await delayNavigation(navigation);
	});

	beforeNavigate(() => {
		loadingBar.style.opacity = '1';
	});

	afterNavigate(() => {
		setTimeout(() => {
			loadingBar.classList.add('animate-fade-out');
		}, 1115);
		setTimeout(() => {
			loadingBar.style.opacity = '0';
			loadingBar.classList.remove('animate-fade-out');
		}, 1125);
	});
</script>


	<div
		bind:this={loadingBar}
		class="loading-bar overflow-clip"
		style="height: 3px; width: 100%; position: fixed; top: 0; right: 0; opacity: 0; z-index: 1000"
	>
		<div style="height: 3px; animation: loading2 3s ease-out 1" class="loading-gradient-2">
			<div
				style="height: 3px; animation: loading 3s ease-out infinite"
				class="loading-gradient w-full origin-right delay-0 duration-1000 ease-linear"
			></div>
		</div>
	</div>

<div class="flex h-screen w-full flex-col overflow-hidden bg-background">
	<!-- Mobile header -->
	<header class="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4 sm:px-6 lg:hidden">
		<Button variant="ghost" size="icon" class="mr-2" onclick={() => mobileMenuOpen = !mobileMenuOpen}>
			{#if mobileMenuOpen}
				<X class="h-5 w-5" />
			{:else}
				<Menu class="h-5 w-5" />
			{/if}
			<span class="sr-only">Toggle Menu</span>
		</Button>
		<div class="flex flex-1 items-center justify-between">
			<div class="flex items-center gap-2">
				<a href="/dashboard" class="flex items-center">
					<span class="text-xl font-semibold">IT Careers</span>
				</a>
			</div>
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon">
					<Search class="h-5 w-5" />
					<span class="sr-only">Search</span>
				</Button>
				<Button variant="ghost" size="icon">
					<UserPlus class="h-5 w-5" />
					<span class="sr-only">Account</span>
				</Button>
			</div>
		</div>
	</header>

	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		<aside class={`
			border-r bg-background transition-all duration-300 ease-in-out
			${mobileMenuOpen ? 'fixed inset-y-0 z-50 block w-72 border-r' : 'hidden'} 
			${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} 
			lg:relative lg:block
		`}>
			<div class="flex h-full flex-col">
				<!-- Sidebar header -->
				<div class={`flex h-14 items-center border-b px-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
					{#if !sidebarCollapsed}
						<a href="/dashboard" class="flex items-center gap-2">
							<span class="text-lg font-semibold">IT Careers</span>
						</a>
					{/if}
					<Button 
						variant="ghost" 
						size="icon" 
						onclick={toggleSidebar} 
						class={`${sidebarCollapsed ? '' : 'ml-auto'} hidden lg:flex`}
					>
						{#if sidebarCollapsed}
							<ChevronRight class="h-4 w-4" />
						{:else}
							<ChevronLeft class="h-4 w-4" />
						{/if}
					</Button>
				</div>

				<!-- Sidebar content -->
				<div class="flex-1 overflow-auto py-2">
					<nav class="grid gap-1 px-2">
						<!-- Dashboard Link -->
						<a 
							href="/dashboard" 
							class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
								${active_link === 0 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
								${sidebarCollapsed ? 'justify-center' : ''}`}
						>
							<Home class="h-5 w-5" />
							{#if !sidebarCollapsed}
								<span>Dashboard</span>
							{/if}
						</a>

						{#if user.AccountType === 'student' || user.AccountType === 'owner'}
							<a 
								href="/dashboard/profile" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 1 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<User class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>Profile</span>
								{/if}
							</a>
							
							<a 
								href="/dashboard/submissions" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 2 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<FileText class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>Submissions</span>
								{/if}
							</a>
						{/if}

						{#if user.AccountType === 'org' || user.AccountType === 'owner'}
							<Separator class="my-2" />
							{#if !sidebarCollapsed}
								<h3 class="px-4 py-1 text-xs font-medium text-muted-foreground">Organization</h3>
							{/if}
							
							<a 
								href="/dashboard/profile" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 1 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<User class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>Organization</span>
								{/if}
							</a>
							
							<a 
								href="/dashboard/jobs" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 2 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<Briefcase class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>Manage Jobs</span>
								{/if}
							</a>
							
							<a 
								href="/dashboard/jobs/new" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 3 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<PlusCircle class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>New Job</span>
								{/if}
							</a>
							
							<Separator class="my-2" />
							{#if !sidebarCollapsed}
								<h3 class="px-4 py-1 text-xs font-medium text-muted-foreground">Applicants & Settings</h3>
							{/if}
							
							<a 
								href="/dashboard/jobs/applicants" 
								class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
									${active_link === 5 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
									${sidebarCollapsed ? 'justify-center' : ''}`}
							>
								<UserSearch class="h-5 w-5" />
								{#if !sidebarCollapsed}
									<span>Applicants</span>
								{/if}
							</a>
						{/if}
						
						<a 
							href="/dashboard/settings" 
							class={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground
								${active_link === 6 ? 'bg-accent/80 text-accent-foreground' : 'text-muted-foreground'} 
								${sidebarCollapsed ? 'justify-center' : ''}`}
						>
							<Settings class="h-5 w-5" />
							{#if !sidebarCollapsed}
								<span>Settings</span>
							{/if}
						</a>
					</nav>
				</div>

				<!-- User profile section -->
				<div class="border-t px-4 py-3">
					{#if !sidebarCollapsed}
						<div class="flex items-center gap-3">
							<img 
								src={user.ProfilePicture} 
								alt="User avatar" 
								class="h-9 w-9 rounded-full border" 
							/>
							<div class="flex flex-col">
								<p class="text-sm font-medium">{user.FirstName} {user.LastName}</p>
								<p class="text-xs text-muted-foreground">{user.Email}</p>
							</div>
						</div>
					{:else}
						<div class="flex justify-center">
							<img 
								src={user.ProfilePicture} 
								alt="User avatar" 
								class="h-9 w-9 rounded-full border" 
							/>
						</div>
					{/if}
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-y-auto">
			<!-- Header with action buttons or breadcrumbs can be added here -->
			<div class="container mx-auto p-4 md:p-6">
				{@render please()}
			</div>
		</main>
	</div>
</div>
