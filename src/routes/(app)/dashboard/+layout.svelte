<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import * as NavShard from '$lib/components/dashboard/shard';
	import { NavLink } from '$lib/types/Navigation';
	import { Cog, Gauge, UserSearch } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const { data, children: please } = $props();
	const { user } = data;
	let active_link = $state(0);

	onMount(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');

		// Set active_link based on the current url
		active_link = NavLink(url);
	});

	afterNavigate(() => {
		// Get the current URL and replace the slashes with dashes
		const url = window.location.pathname.replace(/\//g, '-');

		// Set active_link based on the current url
		active_link = NavLink(url);
	});
</script>

<!-- {#if user}
	{#if user.AccountType === 'org'}
		<div class="flex items-center gap-2 self-stretch px-8 py-2">
			<img
				src={user.ProfilePicture}
				alt="Logo"
				class="h-10 w-10 rounded-full border border-violet-200 bg-violet-50"
			/>
			<h1 class="text-lg font-semibold">
				{@render nameof__person(user as unknown as IJobCreator)}
			</h1>
		</div>
	{/if}
{/if} -->
<top-navigation
	class="flex flex-col items-center self-stretch border-b border-violet-200 bg-violet-50"
>
	<nav class="flex flex-1 justify-between self-stretch">
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
				{#if user.AccountType === 'student' || user.AccountType === 'owner'}
					<NavShard.Link
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
					/>
				{/if}
			</svelte:fragment>
		</NavShard.Root>
		{#if user.AccountType === 'org' || user.AccountType === 'owner'}
			<NavShard.Root title="Organization">
				<svelte:fragment slot="icon">
					<Cog size="20" />
				</svelte:fragment>
				<svelte:fragment slot="shards">
					<NavShard.Link
						a11yLink="/dashboard/profile"
						title="Manage organization"
						onclick={() => goto('/dashboard/organization')}
						active={active_link === 1}
					/>
					<NavShard.Link
						a11yLink="/dashboard/jobs"
						title="Manage jobs"
						onclick={() => goto('/dashboard/jobs')}
						active={active_link === 2}
					/>

					<NavShard.Link
						a11yLink="/dashboard/jobs/new"
						title="New job listing"
						onclick={() => goto('/dashboard/jobs/new')}
						active={active_link === 3}
					/>
				</svelte:fragment>
			</NavShard.Root>

			<NavShard.Root title="Applicants & Settings">
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
			</NavShard.Root>
		{/if}
		<div></div>
		<div></div>
	</nav>
</top-navigation>

{@render please()}
