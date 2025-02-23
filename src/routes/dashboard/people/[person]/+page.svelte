<script lang="ts">
	import { PUBLIC_UI_DEFAULT_COVER_IMAGE } from '$env/static/public';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as UserCard from '$lib/components/vendor/ui/user-card';
	import { getUserFullName } from '$lib/snippets/names/index.js';
	import {
		Calendar,
		Code,
		Database,
		Github,
		Linkedin,
		Mail,
		Phone,
		Terminal,
		Twitter
	} from 'lucide-svelte';
	import { type PageData } from './$types.js';

	// let person = {
	// 	FirstName: 'Alexandro',
	// 	LastName: 'Sanchez',
	// 	Bio: 'I am a software engineer with a passion for building web applications.',
	// 	Hireable: true,
	// 	CreatedAt: new Date().toISOString(),
	// 	Email: 'alexandro@example.com',
	// 	Phone: '+1234567890',
	// 	Skills: ['JavaScript', 'Svelte', 'Node.js'],
	// 	Socials: {
	// 		LinkedIn: 'https://linkedin.com/in/alexandro',
	// 		GitHub: 'https://github.com/alexandro',
	// 		Twitter: 'https://twitter.com/alexandro'
	// 	}
	// };
	const { data: props } = $props();
	const data: PageData = props;

	const person: PageData['person'] = data.person;

	const skillIcons = {
		JavaScript: Code,
		Svelte: Terminal,
		'Node.js': Database
	};
</script>

<page class="min-h-screen bg-gray-50">
	<!-- Header Section with Cover -->
	<header class="relative">
		<!-- Cover Image -->
		<div class="h-[200px] w-full bg-gradient-to-r from-slate-600 to-slate-800 lg:h-[350px]">
			<!-- Optional: Add cover photo here -->
			<img
				alt="CoverPhoto"
				src={person.CoverPhoto === null || person.CoverPhoto?.trim() === ''
					? PUBLIC_UI_DEFAULT_COVER_IMAGE
					: person.CoverPhoto}
				class="w-full"
				style="block-size: 350px; object-fit: cover; object-position: top;"
			/>
		</div>

		<!-- Profile Header -->
		<div class="mx-auto max-w-6xl px-4 py-20 lg:py-24">
			<div class="relative -mt-16 flex flex-col gap-4 lg:-mt-24 lg:flex-row lg:items-end lg:gap-8">
				<!-- Profile Image -->
				<div
					class="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white lg:h-48 lg:w-48"
				>
					<UserCard.ProfileBanner
						image={person.ProfilePicture as string}
						name={getUserFullName(person)}
						username={person.Username}
						hireable={person.Hireable}
					/>
				</div>

				<!-- Name and Title -->
				<div class="flex flex-1 flex-col gap-2">
					<h1 class="flex gap-2 text-2xl font-bold lg:text-4xl">
						{person.FirstName}
						{person.LastName}
						{person.Hireable}
						<span class="tracking-wide">
							{#if person.Hireable}
								<span class="flex h-full w-fit items-start">
									<Badge class="ml-2 bg-success">Hireable</Badge>
								</span>
							{/if}
						</span>
					</h1>
					<p class="text-lg text-slate-600">{person.Bio ?? "Hey there! I'm using talentpool!"}</p>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto flex max-w-6xl flex-col space-y-8 px-4 py-8">
		<!-- Left Column -->
		<div class="flex flex-col gap-6">
			<!-- Contact Information -->
			<Card.Root>
				<Card.Title class="p-4 text-xl font-semibold">Contact Information</Card.Title>
				<Card.Description class="space-y-4 p-4">
					<div class="flex items-center gap-3">
						<Mail class="h-5 w-5 text-slate-500" />
						<span>{person.Email ?? 'Not shared'}</span>
					</div>
					<div class="flex items-center gap-3">
						<Phone class="h-5 w-5 text-slate-500" />
						<span>{person.Phone ?? 'Not shared'}</span>
					</div>
					<div class="flex items-center gap-3">
						<Calendar class="h-5 w-5 text-slate-500" />
						<span>Joined {new Date(person.CreatedAt).toLocaleDateString()}</span>
					</div>
				</Card.Description>
			</Card.Root>

			<!-- Social Links -->
			<Card.Root>
				<Card.Title class="p-4 text-xl font-semibold">Social Profiles</Card.Title>
				<Card.Description class="flex flex-col gap-2 p-4">
					{#if person.Socials.LinkedIn}
						<a
							href={person.Socials.LinkedIn}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100"
						>
							<Linkedin class="h-5 w-5 text-blue-600" />
							<span>LinkedIn Profile</span>
						</a>
					{/if}
					{#if person.Socials.GitHub}
						<a
							href={person.Socials.GitHub}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100"
						>
							<Github class="h-5 w-5 text-slate-800" />
							<span>GitHub Profile</span>
						</a>
					{/if}
					{#if person.Socials.Twitter}
						<a
							href={person.Socials.Twitter}
							target="_blank"
							class="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100"
						>
							<Twitter class="h-5 w-5 text-blue-400" />
							<span>Twitter Profile</span>
						</a>
					{/if}
					{#if Object.keys(person.Socials).length === 0}
						<p class="text-slate">No social profiles found.</p>
					{/if}
				</Card.Description>
			</Card.Root>
		</div>

		<!-- Right Column -->
		<div class="flex flex-col gap-6">
			<!-- About Section -->
			<Card.Root>
				<Card.Title class="p-4 text-xl font-semibold">About</Card.Title>
				<Card.Description class="p-4">
					<p class="text-slate-600">{person.Bio ?? 'Nothing here to see.'}</p>
				</Card.Description>
			</Card.Root>

			<!-- Skills Section -->
			<Card.Root>
				<Card.Title class="p-4 text-xl font-semibold">Skills & Expertise</Card.Title>
				<Card.Description class="p-4">
					<div class="flex flex-wrap gap-2">
						{#snippet icons(skill)}
							{@const Icon = skillIcons[skill] || Code}
							<Icon class="mr-2 h-4 w-4 text-slate-600" />
						{/snippet}
						{#if person.Skills.length === 0}
							<p class="text-slate">No skills shared.</p>
						{/if}

						{#each person.Skills as skill}
							<div class="flex items-center rounded-full bg-slate-100 px-4 py-2">
								{@render icons(skill)}
								<span>{skill}</span>
							</div>
						{/each}
					</div>
				</Card.Description>
			</Card.Root>
		</div>
	</main>
</page>
