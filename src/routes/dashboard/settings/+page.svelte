<script lang="ts">
	import * as UserCard from '$lib/components/vendor/ui/user-card';

	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import Button from '$lib/components/vendor/ui/button/button.svelte';
	import { Calendar } from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;
</script>

<section>
	<section class="header text-archivo flex flex-col space-y-1 pb-8">
		<h1 class="text-5xl font-extralight lg:text-6xl">Your Profile</h1>
		<p class="text-lg lg:text-2xl">Manage and setup your profile</p>
	</section>
	<UserCard.Root class="mb-6 w-full">
		<UserCard.ProfileBanner accent="bg-red-200" />
		<UserCard.Content class="flex flex-col gap-4">
			<UserCard.Title>
				<h1>{user.FirstName + ' ' + user.LastName}</h1>
				<span class="tracking-wide">
					{#if user.Hireable}
						<Badge>Hireable</Badge>
					{/if}
				</span>
			</UserCard.Title>
			<card-description class="flex flex-col gap-2">
				<UserCard.Description>{user.Bio}</UserCard.Description>
				<div class="mb-4 flex flex-row items-center gap-2 text-xs text-slate-400">
					<Calendar strokeWidth="2" size="16" />
					<p>Joined {new Date(user.CreatedAt).toLocaleDateString()}</p>
				</div>
				<Button class="lg:w-fit">Edit Profile</Button>
			</card-description>
		</UserCard.Content>
	</UserCard.Root>
</section>
