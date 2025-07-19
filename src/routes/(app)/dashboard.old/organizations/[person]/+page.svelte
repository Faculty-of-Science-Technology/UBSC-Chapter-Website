<script lang="ts">
	import { PUBLIC_PLATFORM_NAME, PUBLIC_UI_DEFAULT_COVER_IMAGE } from '$env/static/public';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import Button from '$lib/components/vendor/ui/button/button.svelte';
	import * as Card from '$lib/components/vendor/ui/card';
	import {
		Briefcase,
		Building,
		Calendar,
		Camera,
		Code,
		Database,
		Github,
		Globe,
		Linkedin,
		Mail,
		MapPin,
		Terminal,
		Twitter,
		Users
	} from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;

	let organization: PageData['person'] = $state(data.person);

	const skillIcons = {
		JavaScript: Code,
		Svelte: Terminal,
		'Node.js': Database
	};

	let coverPhotoInput = $state<HTMLInputElement | undefined>(undefined);
	let logoInput = $state<HTMLInputElement | undefined>(undefined);

	async function handleCoverPhotoChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const formData = new FormData();
		formData.append('coverPhoto', input.files[0]);

		const response = await fetch(`/api/users/${organization.Id}/cover-photo`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			organization.CoverPhoto = data.url;
		}
	}

	async function handleLogoChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const formData = new FormData();
		formData.append('profilePhoto', input.files[0]);

		const response = await fetch(`/api/users/${organization.Id}/profile-photo`, {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			const data = await response.json();
			organization.ProfilePicture = data.url;
		}
	}
</script>

<page class="min-h-screen bg-gray-50">
	<!-- Header Section with Cover -->
	<header class="relative">
		<!-- Cover Image -->
		<div
			class="relative h-[200px] w-full bg-gradient-to-r from-blue-600 to-blue-800 lg:h-[350px]"
		>
			<img
				alt="Organization Cover Photo"
				src={organization.CoverPhoto === null || organization.CoverPhoto?.trim() === ''
					? PUBLIC_UI_DEFAULT_COVER_IMAGE
					: organization.CoverPhoto}
				class="w-full"
				style="block-size: 350px; object-fit: cover; object-position: top;"
			/>
			{#if data.isOwner}
				<input
					type="file"
					accept="image/*"
					class="hidden"
					bind:this={coverPhotoInput}
					onchange={handleCoverPhotoChange}
				/>
				<Button
					variant="secondary"
					size="sm"
					class="absolute bottom-4 right-4"
					onclick={() => coverPhotoInput!.click()}
				>
					<Camera class="mr-2 h-4 w-4" />
					Change Cover
				</Button>
			{/if}
		</div>

		<!-- Organization Header -->
		<div class="mx-auto max-w-6xl px-4 py-20 lg:py-24">
			<div class="relative -mt-16 flex flex-col gap-4 lg:-mt-24 lg:flex-row lg:items-end lg:gap-8">
				<!-- Organization Logo -->
				<div
					class="relative h-32 w-32 overflow-visible rounded-lg border-4 border-white bg-white lg:h-48 lg:w-48"
				>
					<div class="h-full w-full overflow-hidden rounded-lg">
						<img
							src={organization.ProfilePicture || '/default-organization-logo.png'}
							alt={organization.FirstName}
							class="h-full w-full object-contain"
						/>
					</div>
					{#if data.isOwner}
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={logoInput}
							onchange={handleLogoChange}
						/>
						<Button
							variant="secondary"
							size="sm"
							class="absolute bottom-2 right-2"
							onclick={() => logoInput!.click()}
						>
							<Camera class="h-4 w-4" />
						</Button>
					{/if}
				</div>

				<!-- Organization Name and Description -->
				<div class="flex flex-1 flex-col gap-2">
					<h1 class="flex gap-2 text-2xl font-bold lg:text-4xl">
						{organization.FirstName}
						{organization.LastName}
						<span class="tracking-wide">
							{#if organization.Hireable}
								<span class="flex h-full w-fit items-start">
									<Badge class="ml-2 bg-success">Hiring</Badge>
								</span>
							{/if}
						</span>
					</h1>
					<p class="text-lg text-slate-600">{organization.Bio ?? `A company on ${PUBLIC_PLATFORM_NAME}`}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-3">
		<!-- Left Column -->
		<div class="flex flex-col gap-6 md:col-span-1">
			<!-- Contact Information -->
			<Card.Root>
				<Card.Title class="flex items-center gap-2 p-4 text-xl font-semibold">
					<Building class="h-5 w-5" />
					Organization Information
				</Card.Title>
				<Card.Description class="space-y-4 p-4">
					<div class="flex items-center gap-3">
						<Mail class="h-5 w-5 text-blue-500" />
						<span>{organization.Email ?? 'Not shared'}</span>
					</div>
					<div class="flex items-center gap-3">
						<MapPin class="h-5 w-5 text-blue-500" />
						<span>{organization.Location ?? 'Location not specified'}</span>
					</div>
					<div class="flex items-center gap-3">
						<Users class="h-5 w-5 text-blue-500" />
						<span>{organization.Size ?? 'Company size not specified'}</span>
					</div>
					<div class="flex items-center gap-3">
						<Calendar class="h-5 w-5 text-blue-500" />
						<span>Member since {new Date(organization.CreatedAt).toLocaleDateString()}</span>
					</div>
				</Card.Description>
			</Card.Root>

			<!-- Social Links -->
			<Card.Root>
				<Card.Title class="p-4 text-xl font-semibold">Online Presence</Card.Title>
				<Card.Description class="flex flex-col gap-2 p-4">
					{#if organization.Socials.LinkedIn}
						<a
							href={organization.Socials.LinkedIn}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100"
						>
							<Linkedin class="h-5 w-5 text-blue-600" />
							<span>LinkedIn Company Page</span>
						</a>
					{/if}
					{#if organization.Socials.GitHub}
						<a
							href={organization.Socials.GitHub}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100"
						>
							<Github class="h-5 w-5 text-slate-800" />
							<span>GitHub Organization</span>
						</a>
					{/if}
					{#if organization.Socials.Twitter}
						<a
							href={organization.Socials.Twitter}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100"
						>
							<Twitter class="h-5 w-5 text-blue-400" />
							<span>Twitter Profile</span>
						</a>
					{/if}
					{#if organization.Socials['Personal Website']}
						<a
							href={organization.Socials['Personal Website']}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100"
						>
							<Globe class="h-5 w-5 text-blue-500" />
							<span>Company Website</span>
						</a>
					{/if}
					{#if Object.keys(organization.Socials).length === 0}
						<p class="text-slate-500">No social profiles found.</p>
					{/if}
				</Card.Description>
			</Card.Root>
		</div>

		<!-- Right Column -->
		<div class="flex flex-col gap-6 md:col-span-2">
			<!-- About Section -->
			<Card.Root>
				<Card.Title class="flex items-center gap-2 p-4 text-xl font-semibold">
					<Building class="h-5 w-5" />
					About the Organization
				</Card.Title>
				<Card.Description class="p-4">
					<p class="text-slate-600">{organization.Bio ?? 'No information provided.'}</p>
				</Card.Description>
			</Card.Root>

			<!-- Technologies/Skills Section -->
			<Card.Root>
				<Card.Title class="flex items-center gap-2 p-4 text-xl font-semibold">
					<Briefcase class="h-5 w-5" />
					Technologies & Areas of Expertise
				</Card.Title>
				<Card.Description class="p-4">
					<div class="flex flex-wrap gap-2">
						{#snippet icons(skill)}
							{@const Icon = skillIcons[skill] || Code}
							<Icon class="mr-2 h-4 w-4 text-blue-600" />
						{/snippet}
						{#if organization.Skills.length === 0}
							<p class="text-slate-500">No technologies listed.</p>
						{/if}

						{#each organization.Skills as skill}
							<div class="flex items-center rounded-full bg-blue-100 px-4 py-2">
								{@render icons(skill)}
								<span>{skill}</span>
							</div>
						{/each}
					</div>
				</Card.Description>
			</Card.Root>

			<!-- Open Positions Section (Optional - you could add this) -->
			<Card.Root>
				<Card.Title class="flex items-center gap-2 p-4 text-xl font-semibold">
					<Briefcase class="h-5 w-5" />
					Current Hiring Status
				</Card.Title>
				<Card.Description class="p-4">
					{#if organization.Hireable}
						<div class="rounded-md bg-green-50 p-4">
							<p class="font-medium text-green-800">
								This organization is actively hiring. Contact them to learn more about open positions.
							</p>
						</div>
					{:else}
						<p class="text-slate-500">This organization is not currently advertising open positions.</p>
					{/if}
				</Card.Description>
			</Card.Root>
		</div>
	</main>
</page>
