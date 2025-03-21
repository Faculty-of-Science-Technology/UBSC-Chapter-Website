<script lang="ts">
	import type { AvatarData } from '$lib/assemblies';
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as HoverCard from '$lib/components/vendor/ui/hover-card';
	import * as Tabs from '$lib/components/vendor/ui/tabs/index';
	import { cn } from '$lib/components/vendor/utils';
	import { Building2, ExternalLink } from 'lucide-svelte';
	type PropsData = {
		avatar_data: AvatarData[];
	};
	const { avatar_data }: PropsData = $props();
</script>

<article
	class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg border border-muted p-8 text-left"
>
	<h1 class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">Partner Organizations</h1>
	<p class="text-xl lg:w-[720px]">
		Discover leading Belizean organizations that are empowering the next generation of tech talent.
		These partners provide valuable real-world experience and mentorship opportunities for our
		interns.
	</p>

	<Tabs.Root value="all" class="w-full">
		<Tabs.List class="grid w-full grid-cols-3 gap-4">
			<Tabs.Trigger value="all">All Partners</Tabs.Trigger>
			<Tabs.Trigger value="active">Active Hiring</Tabs.Trigger>
			<Tabs.Trigger value="inactive">Inactive Hiring</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="all">
			<div class="mt-4 p-8 text-center text-muted-foreground">
				{#if avatar_data.length === 0}
					<p class="text-sm text-muted-foreground">No organizations found.</p>
				{/if}
				{#if avatar_data.length > 0}
					<p class="text-sm text-muted-foreground">
						These organizations are currently hiring interns.
					</p>
				{/if}
			</div>
			<!-- Grid starts here -->
			<div class="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each avatar_data as organization}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<a href="/dashboard/organizations/{organization.id}"
								><Avatar.Root
									class={cn(
										'size-34 rounded-md',
										organization.hireable ? 'border-4 border-primary' : ''
									)}
								>
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted">
										<Building2 size={32} />
									</Avatar.Fallback>
								</Avatar.Root></a
							>
						</HoverCard.Trigger>
						<HoverCard.Content class="max-w-80">
							<div class="flex justify-between space-x-4">
								<Avatar.Root
									class={cn('rounded-md', organization.hireable ? 'border-2 border-primary' : '')}
								>
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted"><Building2 /></Avatar.Fallback>
								</Avatar.Root>
								<div class="space-y-1">
									<h4 class="text-sm font-semibold">{organization.name}</h4>
									<span class="tracking-wide">
										{#if organization.hireable}
											<span class="flex h-fit w-fit items-start">
												<Badge class="bg-primary">Active Hiring</Badge>
											</span>
										{/if}
									</span>
									<p class="text-sm">{organization.bio}</p>
									<div class="flex items-center pt-2 text-sm">
										<a
											href="/dashboard/organizations/{organization.id}"
											class="flex gap-2 underline hover:no-underline"
											><ExternalLink size="16" /> View Organization</a
										>
									</div>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="active">
			<!-- Active hiring organizations -->
			<div class="mt-4 p-8 text-center text-muted-foreground">
				{#if avatar_data.filter((org) => org.hireable).length === 0}
					<p class="text-sm text-muted-foreground">No active hiring organizations.</p>
				{/if}
				{#if avatar_data.filter((org) => org.hireable).length > 0}
					<p class="text-sm text-muted-foreground">
						These organizations are currently hiring interns.
					</p>
				{/if}
			</div>
			<div class="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each avatar_data.filter((org) => org.hireable) as organization}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<a href="/dashboard/organizations/{organization.id}"
								><Avatar.Root class="size-34 rounded-md border-4 border-primary">
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted">
										<Building2 size={32} />
									</Avatar.Fallback>
								</Avatar.Root></a
							>
						</HoverCard.Trigger>
						<HoverCard.Content class="max-w-80">
							<!-- Same content as above tab -->
							<div class="flex justify-between space-x-4">
								<Avatar.Root class="rounded-md border-2 border-primary">
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted"><Building2 /></Avatar.Fallback>
								</Avatar.Root>
								<div class="space-y-1">
									<h4 class="text-sm font-semibold">{organization.name}</h4>
									<span class="tracking-wide">
										<span class="flex h-fit w-fit items-start">
											<Badge class="bg-primary">Active Hiring</Badge>
										</span>
									</span>
									<p class="text-sm">{organization.bio}</p>
									<div class="flex items-center pt-2 text-sm">
										<a
											href="/dashboard/organizations/{organization.id}"
											class="flex gap-2 underline hover:no-underline"
											><ExternalLink size="16" /> View Organization</a
										>
									</div>
								</div>
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="inactive">
			<!-- Inactive hiring organizations -->
			<div class="mt-4 p-8 text-center text-muted-foreground">
				{#if avatar_data.filter((org) => !org.hireable).length === 0}
					<p class="text-sm text-muted-foreground">No inactive hiring organizations.</p>
				{/if}
				{#if avatar_data.filter((org) => !org.hireable).length > 0}
					<p class="text-sm text-muted-foreground">
						These organizations are not currently hiring interns.
					</p>
				{/if}
			</div>
			<div class="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each avatar_data.filter((org) => !org.hireable) as organization}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<a href="/dashboard/organizations/{organization.id}"
								><Avatar.Root class="size-34 rounded-md">
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted">
										<Building2 size={32} />
									</Avatar.Fallback>
								</Avatar.Root></a
							>
						</HoverCard.Trigger>
						<HoverCard.Content class="max-w-80">
							<div class="flex justify-between space-x-4">
								<Avatar.Root class="rounded-md">
									<Avatar.Image
										class="object-contain"
										src={organization.image_url}
										alt={organization.name || 'Organization logo'}
									/>
									<Avatar.Fallback class="bg-muted"><Building2 /></Avatar.Fallback>
								</Avatar.Root>
								<div class="space-y-1">
									<h4 class="text-sm font-semibold">{organization.name}</h4>
									<p class="text-sm">{organization.bio}</p>
									<div class="flex items-center pt-2 text-sm">
										<a
											href="/dashboard/organizations/{organization.id}"
											class="flex gap-2 underline hover:no-underline"
											><ExternalLink size="16" /> View Organization</a
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
