<!-- Section Three of landing page -->
<script lang="ts">
	import { AspectRatio } from '$lib/components/vendor/ui/aspect-ratio/index.js';
	import * as Carousel from '$lib/components/vendor/ui/carousel/index.js';
	import * as Dialog from '$lib/components/vendor/ui/dialog/index.js';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';

	interface Group {
		Id: string;
		Title: string;
		Description: string | null;
		Type: 'STANDARD' | 'COMMITTEE';
		IsActive: boolean;
		CreatedAt: Date;
		AgendaId: string | null;
		CreatedBy: string | null;
		members: Array<{
			Id: string;
			CreatedAt: Date;
			UserId: string | null;
			GroupId: string | null;
			user: {
				Id: string;
				AccountType: 'org' | 'student' | 'owner';
				Administrator: boolean;
				FirstName: string;
				LastName: string;
				Email: string;
				Phone: string | null;
				Location: string | null;
				ProfilePicture: string | null;
				CoverPhoto: string | null;
				Password: string;
				Username: string;
				ResumeUrl: string | null;
				ActivationCode: string | null;
				Bio: string | null;
				Hireable: boolean;
				Hidden: boolean;
				InviteCodeUsed: string | null;
				CreatedAt: string;
			} | null;
		}>;
	}

	interface Props {
		statistics: {
			totalMembers: number;
			totalEvents: number;
			totalGroups: number;
			totalPosts: number;
			activeGroups: number;
		};
		groups: Group[];
	}

	let { statistics, groups }: Props = $props();
	
	// Filter to show only active groups
	const activeGroupsList = groups.filter(group => group.IsActive);
	
	// State for dialog
	let selectedGroup: Group | null = $state(null);
</script>

<assembly class="flex flex-col items-start justify-between gap-6">
	<div class="flex flex-row">
		<HeroBlock class="flex-1" no_signup prelude="Start Creating." text="Chapter SIGs"></HeroBlock>
		<HeroBlock
			class="flex-1"
			no_signup
			prelude="About Chapter SIGs"
			subtitle="Find your field of interest and develop your skills beyond the classroom. The ACM Groups cater to a variety of interests, from Artificial Intelligence to Cybersecurity to Digital Music - whatever your interest, there is an group just for you. We currently have {statistics.activeGroups} active groups with {statistics.totalMembers} total members."
		></HeroBlock>
	</div>

	<Carousel.Root class="w-full">
		<Carousel.Content class="-ml-1">
			{#each activeGroupsList as group (group.Id)}
				<Carousel.Item class="pl-1 md:basis-1/2">
					<div class="p-1">
						<button 
							class="w-full text-left transition-transform hover:scale-105"
							onclick={() => selectedGroup = group}
						>
							<AspectRatio ratio={16 / 9} class="bg-gradient-to-br from-blue-500 to-sky-600 relative overflow-hidden rounded-xl">
								<div class="absolute inset-0 bg-muted/40"></div>
								<div class="absolute inset-0 flex flex-col justify-end p-4 text-background">
									<h3 class="font-bold text-lg mb-1">{group.Title}</h3>
									<p class="text-sm opacity-90 line-clamp-2">
										{group.Description || 'A Special Interest Group for ACM members'}
									</p>
									<div class="flex items-center gap-2 mt-2">
										<span class="text-xs bg-background/20 px-2 py-1 rounded">
											{group.Type}
										</span>
										<span class="text-xs">
											{group.members.filter(m => m.user).length} member{group.members.filter(m => m.user).length !== 1 ? 's' : ''}
										</span>
									</div>
								</div>
							</AspectRatio>
						</button>
					</div>
				</Carousel.Item>
			{/each}
			
			{#if activeGroupsList.length === 0}
				<Carousel.Item class="pl-1 md:basis-1/2">
					<div class="p-1">
						<AspectRatio ratio={16 / 9} class="bg-muted flex items-center justify-center">
							<div class="text-center text-secondary/80">
								<p class="text-lg font-medium">No Active Groups</p>
								<p class="text-sm">Check back later for new Special Interest Groups!</p>
							</div>
						</AspectRatio>
					</div>
				</Carousel.Item>
			{/if}
		</Carousel.Content>
		<Carousel.Previous />
		<Carousel.Next />
	</Carousel.Root>
</assembly>

<!-- Group Details Dialog -->
{#if selectedGroup}
	<Dialog.Root open={!!selectedGroup} onOpenChange={(open) => !open && (selectedGroup = null)}>
		<Dialog.Content class="max-w-md">
			<Dialog.Header>
				<Dialog.Title>{selectedGroup.Title}</Dialog.Title>
				<Dialog.Description>
					{selectedGroup.Type === 'COMMITTEE' ? 'Committee' : 'Special Interest Group'}
				</Dialog.Description>
			</Dialog.Header>
			
			<div class="space-y-4">
				{#if selectedGroup.Description}
					<div>
						<h4 class="font-medium mb-2">About</h4>
						<p class="text-sm text-secondary/80">{selectedGroup.Description}</p>
					</div>
				{/if}
				
				<div>
					<h4 class="font-medium mb-2">Members ({selectedGroup.members.filter(m => m.user).length})</h4>
					<div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
						{#each selectedGroup.members.filter(m => m.user) as member}
							{#if member.user}
								<div class="flex items-center gap-2 p-2 rounded-lg bg-muted">
									{#if member.user.ProfilePicture}
										<img 
											src={member.user.ProfilePicture} 
											alt="{member.user.FirstName} {member.user.LastName}"
											class="w-8 h-8 rounded-full object-cover"
										/>
									{:else}
										<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
											<span class="text-xs font-medium">
												{member.user.FirstName[0]}{member.user.LastName[0]}
											</span>
										</div>
									{/if}
									<span class="text-sm font-medium truncate">
										{member.user.FirstName} {member.user.LastName}
									</span>
								</div>
							{/if}
						{/each}
						{#if selectedGroup.members.filter(m => m.user).length === 0}
							<div class="col-span-2 text-center text-sm text-secondary/80 py-4">
								No members yet
							</div>
						{/if}
					</div>
				</div>
				
				<div class="text-xs text-secondary/80">
					Created: {new Date(selectedGroup.CreatedAt).toLocaleDateString()}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
