<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import * as NavShard from '$lib/components/dashboard/shard';
	import { NavLinkIndexes } from '$lib/types/Navigation';
	import { Cog, Gauge } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const { children: please } = $props();
	let active_link = $state(0);

	onMount(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');
		// Set active_link based on the current url
		if (url in NavLinkIndexes) {
			active_link = NavLinkIndexes[url];
		} else {
			active_link = 0; // Default value if URL not found
		}
	});

	afterNavigate(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');

		// Set active_link based on the current url
		if (url in NavLinkIndexes) {
			active_link = NavLinkIndexes[url];
		} else {
			active_link = 0; // Default value if URL not found
		}
	});
</script>

<top-navigation
	class="flex items-center justify-between self-stretch border-b border-slate-200 bg-slate-50"
>
	<nav class="flex flex-1 justify-between">
		<NavShard.Root title="Dashboard">
			<svelte:fragment slot="icon">
				<Gauge size="20" />
			</svelte:fragment>
			<svelte:fragment slot="shards">
				<NavShard.Link
					a11yLink="/dashboard/"
					title="Explore"
					active={active_link === 0}
					onclick={() => goto('/dashboard/')}
				/>
				<!-- <NavShard.Link
					a11yLink="/dashboard/profile"
					title="Manage profile"
					onclick={() => goto('/dashboard/profile')}
					active={active_link === 1}
				/>
				<NavShard.Link
					a11yLink="/dashboard/submissions"
					title="Manage submissions"
					onclick={() => goto('/dashboard/submissions')}
					active={active_link === 2}
				/> -->
			</svelte:fragment>
		</NavShard.Root>
		<NavShard.Root title="Job Posting">
			<svelte:fragment slot="icon">
				<Cog size="20" />
			</svelte:fragment>
			<svelte:fragment slot="shards">
				<NavShard.Link
					a11yLink="/dashboard/jobs/new"
					title="New job listing"
					onclick={() => goto('/dashboard/jobs/new')}
					active={active_link === 3}
				/>
				<!-- <NavShard.Link
					a11yLink="/dashboard/jobs"
					title="Manage job listings"
					onclick={() => goto('/dashboard/jobs')}
					active={active_link === 4}
				/> -->
			</svelte:fragment>
		</NavShard.Root>
		<!-- <NavShard.Root title="Applicants & Settings">
			<svelte:fragment slot="icon">
				<UserSearch size="20" />
			</svelte:fragment>
			<svelte:fragment slot="shards">
				<NavShard.Link
					a11yLink="/dashboard/jobs/applicants"
					title="View applicants"
					onclick={() => goto('/dashboard/jobs/applicants')}
					active={active_link === 5}
				/>
				<NavShard.Link
					a11yLink="/dashboard/settings"
					title="Settings & Privacy"
					onclick={() => goto('/dashboard/settings')}
					active={active_link === 6}
				/>
			</svelte:fragment>
		</NavShard.Root> -->
		<div></div>
		<div></div>
	</nav>
</top-navigation>
{@render please()}
