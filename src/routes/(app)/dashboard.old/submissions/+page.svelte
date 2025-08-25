<script lang="ts">
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button, buttonVariants } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Dialog from '$lib/components/vendor/ui/dialog/';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import * as Pagination from '$lib/components/vendor/ui/pagination';
	import { cn } from '$lib/components/vendor/utils';
	import { nameof__job_creator } from '$lib/snippets/names/index';
	import { posted_relative_time } from '$lib/snippets/time/index';
	import { Briefcase, Clock3 } from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;

	const applications = data.jobApplications;
	const applicationsLength = data.jobsApplicationsLength;
	// Get the amount of pages from the jobs length
	const page_count = Math.ceil(applicationsLength / 10);
	const offset = data.offset;

	// import * as m from '$lib/paraglide/messages.js';
</script>

<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">My Submissions</h1>
		<p class="text-lg lg:text-2xl">View and manage your submissions</p>
	</section>
	<main
		class="text-inter relative flex h-fit flex-col flex-wrap items-start gap-8 self-stretch lg:flex-row"
	>
		<!-- Left Column -->
		<!-- <l-column class="top-20 z-10 flex flex-col items-start gap-6 lg:sticky lg:w-fit">
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
		</l-column> -->
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<Card.Root class="sticky top-20 z-10 w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<div class="flex flex-col items-start justify-start gap-1 py-2">
						<h1>Your submissions</h1>
						{@render submission_paginator()}
					</div>
				</Card.Title>
			</Card.Root>

			{#if applicationsLength === 0}
				<Card.Root class="w-full">
					<Card.Title class="items-center justify-center py-2 text-center text-2xl">
						<h1>You haven't applied to any jobs yet.</h1>
					</Card.Title>
					<Card.Description class="text-center">
						<p>Start applying to jobs to see them here.</p>
					</Card.Description>
				</Card.Root>
			{/if}
			{#each applications as application}
				<JobCard.Root class="w-full">
					<JobCard.Content class="flex flex-col gap-4">
						<JobCard.Title>
							<h2>{application.Jobs?.Title}</h2>
							<div class="flex gap-2">
								<span class="tracking-wide"
									>{#if application.JobApplications.Status === 'rejected'}
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
									{/if}</span
								>

								{#if application.JobApplications.Draft === true && application.Jobs?.Draft}
									<span class="tracking-wide"
										><Badge variant="outline">Currently unavailable</Badge></span
									>
								{/if}

								{#if application.Jobs?.Deleted}
									<span class="tracking-wide"
										><Badge variant="destructive">Listing removed by poster</Badge></span
									>
								{/if}
							</div>
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
							<div class="flex gap-2">
								{#if application.JobApplications.Draft === undefined && !application.Jobs?.Draft}
									<a class="w-fit" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
										><Button class="w-full">Continue application</Button></a
									>
								{:else if application.JobApplications.Draft === true && !application.Jobs?.Draft}
									<a class="w-fit" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
										><Button class="w-full">Continue application</Button></a
									>
								{:else if application.JobApplications.Draft === true && application.Jobs?.Draft}
									<a
										class="w-fit cursor-not-allowed select-none"
										href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
										title="We don't know when this job will be available again. You can either wait or revoke your application."
										><Button class="w-full" disabled>Continue application</Button></a
									>
								{:else}
									<a class="w-fit" href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}"
										><Button class="w-full">View submission</Button></a
									>
								{/if}
								<Dialog.Root>
									<Dialog.Trigger class={cn(buttonVariants({ variant: 'destructive' }), 'w-fit')}
										>Revoke application</Dialog.Trigger
									>
									<Dialog.Content class="sm:max-w-[425px]">
										<Dialog.Header>
											<Dialog.Title
												>Delete '{application.Jobs?.Title}' from '{application.Users?.FirstName +
													' ' +
													application.Users?.LastName}'</Dialog.Title
											>
											<Dialog.Description>
												You can reapply after. Are you sure you want to delete it?
											</Dialog.Description>
										</Dialog.Header>
										<div class="flex flex-col gap-6 py-4">
											<Dialog.Footer class="justify-start text-left">
												<form method="POST">
													<input
														type="hidden"
														name="application_id"
														value={application?.JobApplications.Id}
													/>
													<!-- <input type="hidden" name="user_id" value={application.Users?.Id} /> -->
													<!-- <input type="hidden" name="application_id" value={application.JobApplications.Id} /> -->
													<input type="hidden" name="action" value="delete" />
													<Button type="submit" class="bg-destructive">Revoke & Delete</Button>
												</form>
											</Dialog.Footer>
										</div></Dialog.Content
									>
								</Dialog.Root>
							</div>
						</card-description>
					</JobCard.Content>
				</JobCard.Root>
			{/each}
			{@render submission_paginator()}
			{#snippet submission_paginator()}
				<Pagination.Root count={applicationsLength} perPage={10} page={offset}>
					{#snippet children({ pages, currentPage })}
						<Pagination.Content>
							<Pagination.Item>
								<a href="/dashboard/submissions?page={currentPage < 1 ? 1 : currentPage}"
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
										<a href="/dashboard/submissions?page={page.value}">
											<Pagination.Link {page} isActive={currentPage === page.value}>
												{page.value}
											</Pagination.Link></a
										>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<a
									href="/dashboard/submissions?page={currentPage > page_count
										? page_count
										: currentPage}"><Pagination.NextButton /></a
								>
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>
			{/snippet}
		</r-column>
	</main>
</page>
