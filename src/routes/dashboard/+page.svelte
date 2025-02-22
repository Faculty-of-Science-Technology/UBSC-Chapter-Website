<script lang="ts">
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import * as Pagination from '$lib/components/vendor/ui/pagination';
	import * as UserCard from '$lib/components/vendor/ui/user-card';
	import { nameof__job_creator } from '$lib/snippets/names/index';
	import { posted_relative_time } from '$lib/snippets/time/index';
	import { Briefcase, Calendar, Clock3 } from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;

	const jobs = data.jobs;
	const jobsLength = data.jobsLength;
	// Get the amount of pages from the jobs length
	const page_count = Math.ceil(jobsLength / 10);
	const offset = data.offset;

	const jobApplications = data.jobApplications;

	// import * as m from '$lib/paraglide/messages.js';
</script>

<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">My Dashboard</h1>
		<p class="text-lg lg:text-2xl">Your profile at a glance</p>
	</section>
	<main
		class="text-inter relative flex h-fit flex-col flex-wrap items-start gap-8 self-stretch lg:flex-row"
	>
		<!-- Left Column -->
		<l-column class="top-20 z-10 flex flex-col items-start gap-6 lg:sticky lg:w-fit">
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
					<h1>Most Recent Application</h1>
				</Card.Title>
			</Card.Root>
			{#if jobApplications.length === 0}
				<Card.Root class="w-full py-8">
					<Card.Title class="items-center justify-center py-2 text-center text-md">
						<h1>You haven't applied to any jobs yet.</h1>
					</Card.Title>
					<Card.Description class="text-center text-xs">
						<p>Start applying to jobs to see them here.</p>
					</Card.Description>
				</Card.Root>
			{/if}
			{#each jobApplications as application}
				<JobCard.Root class="w-[305px] lg:w-[320px]">
					<JobCard.Content class="flex flex-col gap-4">
						<JobCard.Title>
							<h2>{application.Jobs?.Title}</h2>
							<span class="tracking-wide">
								{#if application.JobApplications.Status === 'rejected'}
									<Badge
										class="bg-destructive
										">{application.JobApplications.Status}</Badge
									>
								{:else if application.JobApplications.Status === 'approved'}
									<Badge
										class="bg-success
										">{application.JobApplications.Status}</Badge
									>
								{:else}
									<Badge
										>{application.JobApplications.Draft === undefined
											? 'Draft (Unsaved)'
											: application.JobApplications.Draft === true
												? 'Draft (Saved)'
												: application.JobApplications.Status}</Badge
									>
								{/if}
							</span>
						</JobCard.Title>
						<card-description class="flex flex-col gap-2">
							<JobCard.Description
								>{@render nameof__job_creator(application.Users)}</JobCard.Description
							>
							<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
								<Briefcase strokeWidth="2" size="16" />
								<p>{application.JobTypes?.Name}</p>
							</div>
							<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
								<Clock3 strokeWidth="2" size="16" />
								<p>{@render posted_relative_time(application)}</p>
							</div>

							{#if application.JobApplications.Draft === undefined && !application.Jobs?.Draft}
								<a class="w-full" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
									><Button class="w-full">Continue application</Button></a
								>
							{:else if application.JobApplications.Draft === true && !application.Jobs?.Draft}
								<a class="w-full" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
									><Button class="w-full">Continue application</Button></a
								>
							{:else if application.JobApplications.Draft === true && application.Jobs?.Draft}
								<a
									class="w-full cursor-not-allowed select-none"
									href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
									title="This job is no longer available"
									><Button class="w-full" disabled>Continue application</Button></a
								>
							{:else}
								<a class="w-full" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
									><Button class="w-full">View submission</Button></a
								>
							{/if}
						</card-description>
					</JobCard.Content>
				</JobCard.Root>
			{/each}
			{#if jobApplications.length > 0}
				<a class="w-full" href="/dashboard/submissions">
					<Button class="w-full">View all applications</Button></a
				>
			{/if}
		</l-column>
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<Card.Root class="sticky top-20 w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<div class="flex flex-col items-start justify-start gap-1 py-2">
						<h1>Explore available jobs</h1>
						{@render jobs_paginator()}
					</div>
				</Card.Title>
			</Card.Root>
			{#if jobs.length === 0}
				<Card.Root class="w-full">
					<Card.Title class="items-center justify-center py-2 text-center text-2xl">
						<h1>There's nothing more left to see here. Sorry!</h1>
					</Card.Title>
				</Card.Root>
			{/if}
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
									{@render posted_relative_time(job)}
								</div>
							</div>
							<a href="/dashboard/jobs/view/{job.Jobs.Id}">
								<Button class="w-fit">Apply for this job</Button></a
							>
						</card-description>
					</JobCard.Content>
				</JobCard.Root>
			{/each}

			{@render jobs_paginator()}
			{#snippet jobs_paginator()}
				<Pagination.Root count={jobsLength} perPage={10} page={offset}>
					{#snippet children({ pages, currentPage })}
						<Pagination.Content>
							<Pagination.Item>
								<a href="/dashboard?page={currentPage < 1 ? 1 : currentPage}"
									><Pagination.PrevButton /></a
								>
							</Pagination.Item>
							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
									<Pagination.Item>
										<Pagination.Ellipsis />
									</Pagination.Item>
								{:else}
									<Pagination.Item>
										<a href="/dashboard?page={page.value}">
											<Pagination.Link {page} isActive={currentPage === page.value}>
												{page.value}
											</Pagination.Link></a
										>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<a href="/dashboard?page={currentPage > page_count ? page_count : currentPage}"
									><Pagination.NextButton /></a
								>
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			{/snippet}
		</r-column>
	</main>
</page>
