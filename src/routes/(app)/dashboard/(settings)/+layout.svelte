<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import * as DashMenu from '$lib/components/vendor/ui/dashmenu/index';
	import MenuItem from '$lib/components/vendor/ui/menuitem/menuitem.svelte';
	import { Separator } from '$lib/components/vendor/ui/separator/index.js';
	import { NavLink, _Settings_NavLinkIndexes } from '$lib/types/Navigation';
	import {
		InfoIcon,
		LucideCalendarCog,
		UserIcon,
		Users
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	let { children, data } = $props();
	let active_link = $state(0);
	const user = data.user;

	onMount(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');

		// Set active_link based on the current url
		active_link = NavLink(url, { repository: _Settings_NavLinkIndexes });
	});

	afterNavigate(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');

		// Set active_link based on the current url
		active_link = NavLink(url, { repository: _Settings_NavLinkIndexes });
	});
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
		}

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<page class="flex h-svh">
	<DashMenu.Root class="h-full rounded-none border-b-0 border-l-0 border-r border-t-0 bg-violet-50">
		<DashMenu.Content>
			<DashMenu.Heading
				class="text-archivo text-lg font-extralight lg:text-4xl"
				title="Settings & Privacy"
			/>
			<DashMenu.Items>
				<a href="/dashboard/settings" aria-label="Your Profile">
					<MenuItem
						noborder
						cursor="pointer"
						title="Your Profile"
						class={active_link === 0 ? 'bg-accent' : ''}
					>
						<svelte:fragment slot="start-icon">
							<UserIcon class="size-5" />
						</svelte:fragment>
						⌘P
					</MenuItem>
				</a>
				<!-- <a href="/dashboard/settings/notifications" aria-label="Notifications">
					<MenuItem
						noborder
						cursor="pointer"
						title="Notifications"
						class={active_link === 1 ? 'bg-accent' : ''}
					>
						<svelte:fragment slot="start-icon">
							<MessageSquareMoreIcon class="size-5" />
						</svelte:fragment>
						⌘M
					</MenuItem>
				</a> -->
				{#if user.AccountType === 'owner'}
					<Separator />
					<DashMenu.Heading class="text-md" title="Administrative Tasks" />
					<a href="/dashboard/settings/setup-agenda" aria-label="Manage Agenda">
						<MenuItem
							noborder
							cursor="pointer"
							title="Manage Agenda"
							class={active_link === 2 ? 'bg-accent' : ''}
						>
							<svelte:fragment slot="start-icon">
								<LucideCalendarCog class="size-5" />
							</svelte:fragment>
							⌘F
						</MenuItem>
					</a>

					<a href="/dashboard/settings/manage-users" aria-label="Manage Users">
						<MenuItem
							noborder
							cursor="pointer"
							title="Manage Users"
							class={active_link === 3 ? 'bg-accent' : ''}
						>
							<svelte:fragment slot="start-icon">
								<Users class="size-5" />
							</svelte:fragment>
							⌘U
						</MenuItem>
					</a>
				{/if}
				<a href="/dashboard/settings/about-system" aria-label="About App">
					<MenuItem
						noborder
						cursor="pointer"
						title="About App"
						class={active_link === 4 ? 'bg-accent' : ''}
					>
						<svelte:fragment slot="start-icon">
							<InfoIcon class="size-5" />
						</svelte:fragment>
						⌘G
					</MenuItem>
				</a>
			</DashMenu.Items>
		</DashMenu.Content>
	</DashMenu.Root>
	<main class="flex-1 overflow-auto bg-gray-100 p-8">
		{@render children?.()}
	</main>
</page>

<style>
	/* Make <main/>'s scrollbar so small it's invisible */
	main {
		scrollbar-width: thin;
		scrollbar-color: transparent transparent;
	}
</style>
