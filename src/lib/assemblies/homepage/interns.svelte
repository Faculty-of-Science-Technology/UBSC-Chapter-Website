<script lang="ts">
	import type { AvatarData } from '$lib/assemblies';
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as HoverCard from '$lib/components/vendor/ui/hover-card';
	import * as Tabs from '$lib/components/vendor/ui/tabs/index';
	import { cn } from '$lib/components/vendor/utils';
	import { Link } from 'lucide-svelte';
	type PropsData = {
		avatar_data: AvatarData[];
	};
	const { avatar_data }: PropsData = $props();
</script>

<article
	class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg border border-muted p-8 text-left"
>
	<h1 class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">
		Meet Belize's Next Tech Leaders
	</h1>
	<p class="text-xl lg:w-[720px]">
		Discover ambitious tech talent ready to transform your organization. Our interns bring fresh
		perspectives, current skills, and endless potential to every project they touch.
	</p>

	<Tabs.Root value="everyone" class="w-full">
		<Tabs.List class="grid w-full grid-cols-3 gap-4">
			<Tabs.Trigger value="everyone">Everyone</Tabs.Trigger>
			<!-- <Tabs.Trigger value="bachelors">Bachelors</Tabs.Trigger>
			<Tabs.Trigger value="associates">Associates</Tabs.Trigger> -->
		</Tabs.List>
		<Tabs.Content value="everyone">
			<div class="mt-4 p-8 text-center text-muted-foreground">
				{#if avatar_data.length === 0}
					<p class="text-sm text-muted-foreground">No users found.</p>
				{/if}
				{#if avatar_data.length > 0}
					<p class="text-sm text-muted-foreground">
						{avatar_data.length}
						{avatar_data.length === 1 ? 'user' : 'users'} found.
					</p>
				{/if}
			</div>
			<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12">
				<!-- Grid starts here -->
				{#each avatar_data as avatar}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<a href="/dashboard/people/{avatar.id}"
								><Avatar.Root
									class={cn('size-20', avatar.hireable ? 'border-4 border-success' : '')}
								>
									<Avatar.Image src={avatar.image_url} alt={avatar.name || 'Profile picture'} />
									<Avatar.Fallback>
										{avatar.name?.[0] || '?'}
									</Avatar.Fallback>
								</Avatar.Root></a
							>
						</HoverCard.Trigger>
						<HoverCard.Content class="max-w-72">
							<div class="flex justify-between space-x-4">
								<Avatar.Root class={cn(avatar.hireable ? 'border-2 border-success' : '')}>
									<Avatar.Image src={avatar.image_url} alt={avatar.name || 'Profile picture'} />
									<Avatar.Fallback>{avatar.name?.[0] || '?'}</Avatar.Fallback>
								</Avatar.Root>
								<div class="space-y-1">
									<h4 class="text-sm font-semibold">{avatar.name}</h4>
									<span class="tracking-wide">
										{#if avatar.hireable}
											<span class="flex h-fit w-fit items-start">
												<Badge class="bg-success">Hireable</Badge>
											</span>
										{/if}
									</span>
									<p class="text-sm">{avatar.bio}</p>
									<div class="flex items-center pt-2 text-sm">
										<a
											href="/dashboard/people/{avatar.id}"
											class="flex gap-2 underline hover:no-underline"
											><Link size="16" /> View Profile</a
										>
									</div>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/each}
			</div>
		</Tabs.Content>
	</Tabs.Root>
</article>
