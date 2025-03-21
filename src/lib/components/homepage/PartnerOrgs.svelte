<script lang="ts">
	import type { AvatarData } from '$lib/assemblies';

	import { Badge, Building2, ExternalLink } from 'lucide-svelte';

	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import * as HoverCard from '$lib/components/vendor/ui/hover-card';
	import { cn } from '$lib/components/vendor/utils';
	import type { Snippet } from 'svelte';

	type PartnerOrgsProps = {
		org_avatar_data: AvatarData[];
		children: Snippet<[]> | undefined;
	};
	let { org_avatar_data, children }: PartnerOrgsProps = $props();
</script>

{#if org_avatar_data.length > 0}
	<h2 class="text-gray-750 mb-6 mt-12 text-center text-2xl font-medium lg:text-left">
		Our Partner Organizations
	</h2>
	<div class="mt-2 flex flex-row justify-start gap-4">
		{#each org_avatar_data.slice(0, 6) as organization}
			<HoverCard.Root>
				<HoverCard.Trigger>
					<a href="/dashboard/organizations/{organization.id}"
						><Avatar.Root
							class={cn(
								'size-16 rounded-md',
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
	{@render children?.()}
{:else}
	<p class="text-sm text-gray-600">No partner organizations available.</p>
{/if}
