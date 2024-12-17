<script lang="ts">
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import * as UserCard from '$lib/components/vendor/ui/user-card';
	import { Briefcase, Calendar, Clock3 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { type PageData } from './$types.js';
	const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });
	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;
	const jobs = data.jobs;

	// import * as m from '$lib/paraglide/messages.js';
	onMount(() => {
		console.log('mounted');
		console.log(user);
	});
</script>

<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">My Dashboard</h1>
		<p class="text-lg lg:text-2xl">Your profile at a glance</p>
	</section>
	<main class="text-inter flex flex-wrap items-start gap-8 self-stretch">
		<!-- Left Column -->
		<l-column class="flex w-fit flex-col items-start gap-6">
			<UserCard.Root class="mb-6 w-[305px] lg:w-[320px]">
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
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Calendar strokeWidth="2" size="16" />
							<p>Joined {new Date(user.CreatedAt).toLocaleDateString()}</p>
						</div>
					</card-description>
				</UserCard.Content>
			</UserCard.Root>
			<Card.Root class="w-full">
				<Card.Title class="items-center justify-center py-2 text-center text-2xl">
					<h1>Submitted Applications</h1>
				</Card.Title>
			</Card.Root>
			<JobCard.Root class="w-[305px] lg:w-[320px]">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title>
						<h2>Remote Senior Backend Software Engineer</h2>
						<span class="tracking-wide"><Badge>Draft</Badge></span>
					</JobCard.Title>
					<card-description class="flex flex-col gap-2">
						<JobCard.Description>HireLATAM</JobCard.Description>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Briefcase strokeWidth="2" size="16" />
							<p>Belize (In-Person)</p>
						</div>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Clock3 strokeWidth="2" size="16" />
							<p>5m ago</p>
						</div>
						<Button>Continue application</Button>
					</card-description>
				</JobCard.Content>
			</JobCard.Root>
		</l-column>
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<Card.Root class="w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<h1>Explore Available Jobs</h1>
				</Card.Title>
			</Card.Root>
			{#each jobs as job}
				<JobCard.Root class="w-full">
					<JobCard.Content class="flex flex-col gap-4">
						<JobCard.Title class="flex flex-col gap-2">
							<h2>{job.Jobs.Title}</h2>
							<Badge class="w-fit text-base"
								>${job.Jobs.MinRate}/hr &ndash; ${job.Jobs.MaxRate}/hr</Badge
							>
						</JobCard.Title>
						<card-description class="flex flex-col gap-6">
							<div class="flex flex-col gap-2">
								<JobCard.Description
									>{job.Users?.FirstName + ' ' + job.Users?.LastName}</JobCard.Description
								>
								<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
									<Briefcase strokeWidth="2" size="16" />
									<p>{job.JobTypes?.Name}</p>
								</div>
								<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
									<Clock3 strokeWidth="2" size="16" />
									{#if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / 1000) < 60}
										<p>
											{rtf1.format(
												Math.round((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / 1000),
												'seconds'
											)}
										</p>
									{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60)) < 60}
										<p>
											{rtf1.format(
												Math.round(
													(new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60)
												),
												'minutes'
											)}
										</p>
									{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)) < 12}
										<p>
											{rtf1.format(
												Math.round(
													(new Date(job.Jobs.CreatedAt).getTime() - Date.now()) /
														(1000 * 60 * 60 * 24 * 30)
												),
												'months'
											)}
										</p>
									{:else}
										<p>
											{rtf1.format(
												Math.round(
													(new Date(job.Jobs.CreatedAt).getTime() - Date.now()) /
														(1000 * 60 * 60 * 24 * 365)
												),
												'years'
											)}
										</p>
									{/if}
								</div>
							</div>
							<a href="/dashboard/jobs/view/{job.Jobs.Id}">
								<Button class="w-fit">Apply for this job</Button></a
							>
						</card-description>
					</JobCard.Content>
				</JobCard.Root>
			{/each}
		</r-column>
	</main>
</page>
