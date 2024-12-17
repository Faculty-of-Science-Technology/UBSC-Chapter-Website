<script lang="ts">
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Briefcase, Clock3, DollarSign } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	const { data: props } = $props();
	const data: PageData = props;
	const job_obj = data.job;
	const job = job_obj.Jobs;
	const job_type = job_obj.JobTypes;
	const job_creator = job_obj.Users;
	const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });

	onMount(() => {
		console.log(data);
	});
	// import * as m from '$lib/paraglide/messages.js';
</script>

{#snippet posted_relative_time()}
	{#if Math.abs((new Date(job.CreatedAt).getTime() - Date.now()) / 1000) < 60}
		<p>
			{rtf1.format(Math.round((new Date(job.CreatedAt).getTime() - Date.now()) / 1000), 'seconds')}
		</p>
	{:else if Math.abs((new Date(job.CreatedAt).getTime() - Date.now()) / (1000 * 60)) < 60}
		<p>
			{rtf1.format(
				Math.round((new Date(job.CreatedAt).getTime() - Date.now()) / (1000 * 60)),
				'minutes'
			)}
		</p>
	{:else if Math.abs((new Date(job.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)) < 12}
		<p>
			{rtf1.format(
				Math.round((new Date(job.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)),
				'months'
			)}
		</p>
	{:else}
		<p>
			{rtf1.format(
				Math.round((new Date(job.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365)),
				'years'
			)}
		</p>
	{/if}
{/snippet}

<!-- svelte-ignore component_name_lowercase -->
<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">View Jobs</h1>
		<p class="text-lg lg:text-2xl">View and apply for a job</p>
	</section>
	<main class="text-inter flex flex-wrap items-start gap-8 self-stretch">
		<!-- Left Column -->
		<l-column class="flex w-fit flex-col items-start gap-6">
			<Card.Root class="w-full">
				<Card.Title class="items-center justify-center py-2 text-center text-2xl">
					<p>Explore Available Jobs</p>
				</Card.Title>
			</Card.Root>
			<JobCard.Root class="w-[305px] lg:w-[320px]">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title>
						<p>{job.Title}</p>
						<span class="tracking-wide"
							><Badge
								>{job.Draft === undefined
									? 'Draft (Unsaved)'
									: job.Draft === true
										? 'Draft (Saved)'
										: 'Live'}</Badge
							></span
						>
					</JobCard.Title>
					<card-description class="flex flex-col gap-2">
						<JobCard.Description
							>{job_creator?.FirstName + ' ' + job_creator?.LastName}</JobCard.Description
						>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Briefcase strokeWidth="2" size="16" />
							<p>{job_type?.Name}</p>
						</div>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Clock3 strokeWidth="2" size="16" />
							{@render posted_relative_time()}
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
					<p>Post by {job_creator?.FirstName + ' ' + job_creator?.LastName}</p>
				</Card.Title>
			</Card.Root>
			<JobCard.Root class="w-full">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title class="flex flex-col gap-2">
						<p>{job.Title}</p>
					</JobCard.Title>
					<card-description class="flex flex-col gap-6">
						<div class="flex flex-col gap-2">
							<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
								<DollarSign strokeWidth="2" size="16" />
								<p>${job.MinRate}/hr &ndash; ${job.MaxRate}/hr</p>
							</div>
							<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
								<Briefcase strokeWidth="2" size="16" />
								<p>{job_type?.Name}</p>
							</div>
							<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
								<Clock3 strokeWidth="2" size="16" />
								<p>{@render posted_relative_time()}</p>
							</div>
						</div>
						<div class="flex gap-3">
							<a href="/dashboard/jobs/apply?job_id={job.Id}"
								><Button class="w-fit">Apply for this job</Button></a
							>
							<a href="/dashboard/jobs/new?job_id={job.Id}"
								><Button class="w-fit">Edit job</Button></a
							>
						</div>
						<article>
							<section class="flex flex-col gap-4 text-black">
								{@html job.Description}
							</section>
						</article>
					</card-description>
				</JobCard.Content>
			</JobCard.Root>
		</r-column>
	</main>
</page>
