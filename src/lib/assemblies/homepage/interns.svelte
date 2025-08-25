<script lang="ts">
	import type { AvatarData, GroupData } from '$lib/assemblies';
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as HoverCard from '$lib/components/vendor/ui/hover-card';
	import * as Tabs from '$lib/components/vendor/ui/tabs/index';
	import { cn } from '$lib/components/vendor/utils';
	import { Link } from 'lucide-svelte';
	type PropsData = {
		avatar_data: AvatarData[];
		group_data: GroupData[];
	};
	const { avatar_data, group_data }: PropsData = $props();
</script>

<article
	class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg border border-muted p-8 text-left"
>
	<h1 class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">
		Meet Belize's Emerging Tech Talent
	</h1>
	<p class="text-xl lg:w-[720px]">
		Discover ambitious students and alumni from the University of Belize's IT program — ready to
		contribute, innovate, and grow with your organization. From fresh perspectives to practical
		experience, UB IT talent brings energy, insight, and a passion for technology to every
		opportunity.
	</p>

	<Tabs.Root value="everyone" class="w-full">
		<Tabs.List class="grid w-full grid-cols-3 gap-4">
			<Tabs.Trigger value="everyone">Everyone</Tabs.Trigger>
			{#each group_data as group}
				<Tabs.Trigger value={group.Id}>{group.Title}</Tabs.Trigger>
			{/each}
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
					<!--- Display only activated users -->
					{#if avatar.activation_code === null}
						<HoverCard.Root>
							<HoverCard.Trigger>
								<a href="/dashboard/people/{avatar.id}"
									><Avatar.Root
										class={cn('size-20', avatar.hireable ? 'border-4 border-success' : '')}
									>
										<Avatar.Image
											class="object-cover"
											src={avatar.image_url}
											alt={avatar.name || 'Profile picture'}
										/>
										<Avatar.Fallback>
											{avatar.name?.[0] || '?'}
										</Avatar.Fallback>
									</Avatar.Root></a
								>
							</HoverCard.Trigger>
							<HoverCard.Content class="max-w-72">
								<div class="flex justify-between space-x-4">
									<Avatar.Root class={cn(avatar.hireable ? 'border-2 border-success' : '')}>
										<Avatar.Image
											class="object-cover"
											src={avatar.image_url}
											alt={avatar.name || 'Profile picture'}
										/>
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
											<svelte:element
												this="a"
												href="/dashboard/people/{avatar.id}"
												class="flex gap-2 underline hover:no-underline"
												role="link"
												tabindex="0"
												onclick={(e) => e.stopPropagation()}
											>
												<Link size="16" /> View Profile
											</svelte:element>
										</div>
									</div>
								</div>
							</HoverCard.Content>
						</HoverCard.Root>
					{/if}
				{/each}
			</div>
		</Tabs.Content>

		{#each group_data as group}
			<Tabs.Content value={group.Id}>
				<div class="mt-4 p-8 text-center text-muted-foreground">
					{#if group.members.length === 0}
						<p class="text-sm text-muted-foreground">No users found.</p>
					{/if}
					{#if group.members.length > 0}
						<p class="text-sm text-muted-foreground">
							{group.members.length}
							{group.members.length === 1 ? 'user' : 'users'} found.
						</p>
					{/if}
				</div>
				<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-12">
					<!-- Grid starts here -->
					{#each group.members as avatar}
						{#if avatar.user !== undefined && avatar.user !== null && avatar.user.ActivationCode === null}
							<HoverCard.Root>
								<HoverCard.Trigger>
									<a href="/dashboard/people/{avatar.user.Id}"
										><Avatar.Root
											class={cn('size-20', avatar.user.Hireable ? 'border-4 border-success' : '')}
										>
											<Avatar.Image
												class="object-cover"
												src={avatar.user.ProfilePicture}
												alt={avatar.user.FirstName + ' ' + avatar.user.LastName ||
													'Profile picture'}
											/>
											<Avatar.Fallback>
												{avatar.user.FirstName[0] + avatar.user.LastName[0] || '?'}
											</Avatar.Fallback>
										</Avatar.Root></a
									>
								</HoverCard.Trigger>
								<HoverCard.Content class="max-w-72">
									<div class="flex justify-between space-x-4">
										<Avatar.Root class={cn(avatar.user.Hireable ? 'border-2 border-success' : '')}>
											<Avatar.Image
												class="object-cover"
												src={avatar.user.ProfilePicture}
												alt={avatar.user.FirstName + ' ' + avatar.user.LastName ||
													'Profile picture'}
											/>
											<Avatar.Fallback
												>{avatar.user.FirstName[0] + avatar.user.LastName[0] ||
													'?'}</Avatar.Fallback
											>
										</Avatar.Root>
										<div class="space-y-1">
											<h4 class="text-sm font-semibold">
												{avatar.user.FirstName + avatar.user.LastName}
											</h4>
											<span class="tracking-wide">
												{#if avatar.user.Hireable}
													<span class="flex h-fit w-fit items-start">
														<Badge class="bg-success">Hireable</Badge>
													</span>
												{/if}
											</span>
											<p class="text-sm">{avatar.user.Bio}</p>
											<div class="flex items-center pt-2 text-sm">
												<svelte:element
													this="a"
													href="/dashboard/people/{avatar.user.Id}"
													class="flex gap-2 underline hover:no-underline"
													role="link"
													tabindex="0"
													onclick={(e) => e.stopPropagation()}
												>
													<Link size="16" /> View Profile
												</svelte:element>
											</div>
										</div>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>
						{/if}
					{/each}
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</article>
