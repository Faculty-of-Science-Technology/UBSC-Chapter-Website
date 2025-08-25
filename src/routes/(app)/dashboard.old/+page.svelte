<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/vendor/ui/avatar/index.js';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Pagination from '$lib/components/vendor/ui/pagination';
	import { getUserFullName, nameof__job_creator } from '$lib/snippets/names/index';
	import { type IJobCreator } from '$lib/snippets/names/index.svelte';
	import { posted_relative_time } from '$lib/snippets/time/index';
	import {
		Briefcase,
		Building,
		Calendar,
		Clock3,
		DollarSign,
		ExternalLink,
		FileCheck,
		Info,
		PenLine,
		User
	} from 'lucide-svelte';
	import { type PageProps } from './$types.js';

	const { data }: PageProps = $props();
	const user = data.user;

	const jobs = data.jobs;
	const jobsLength = data.jobsLength;

	const pages_length = data.pagination.totalPages * data.pagination.itemsPerPage;
	const page_count = data.pagination.totalPages;
	const page_items_per_page = data.pagination.itemsPerPage;
	const offset = data.pagination.currentPage;

	const jobApplications = data.jobApplications;

	// For date formatting in stats
	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	};
</script>

<div class="flex flex-col gap-6">
	<!-- Welcome section with stats -->
	<section class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		<Card.Root>
			<Card.Content class="flex flex-col gap-2 p-6">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium">Applied Jobs</h3>
					<div class="rounded-full bg-blue-100 p-2 text-blue-600">
						<FileCheck size={18} />
					</div>
				</div>
				<div class="text-2xl font-semibold">{data.jobApplications?.length || 0}</div>
				<div class="text-xs text-muted-foreground">Applications this quarter</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="flex flex-col gap-2 p-6">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium">Available Jobs</h3>
					<div class="rounded-full bg-emerald-100 p-2 text-emerald-600">
						<Briefcase size={18} />
					</div>
				</div>
				<div class="text-2xl font-semibold">{jobsLength}</div>
				<div class="text-xs text-muted-foreground">Active listings</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="flex flex-col gap-2 p-6">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium">Account Type</h3>
					<div class="rounded-full bg-violet-100 p-2 text-violet-600">
						<User size={18} />
					</div>
				</div>
				<div class="text-2xl font-semibold capitalize">{user.AccountType}</div>
				<div class="text-xs text-muted-foreground">Account status: Active</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="flex flex-col gap-2 p-6">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-medium">Member Since</h3>
					<div class="rounded-full bg-amber-100 p-2 text-amber-600">
						<Calendar size={18} />
					</div>
				</div>
				<div class="text-2xl font-semibold">{formatDate(user.CreatedAt)}</div>
				<div class="text-xs text-muted-foreground">{new Date(user.CreatedAt).getFullYear()}</div>
			</Card.Content>
		</Card.Root>
	</section>

	<div class="grid gap-6 md:grid-cols-7">
		<!-- Left sidebar with profile and recent applications -->
		<div class="flex flex-col gap-6 md:col-span-2">
			<!-- User Profile Card -->
			<Card.Root>
				<Card.Header class="pb-0">
					<Card.Title>Your Profile</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col items-center gap-4 py-4 text-center">
					<div class="relative">
						<Avatar.Root class="h-24 w-24">
							<Avatar.Image
								class="object-cover"
								src={user.ProfilePicture}
								alt={getUserFullName(user as IJobCreator)}
							/>
							<Avatar.Fallback>{user.FirstName[0]}{user.LastName[0]}</Avatar.Fallback>
						</Avatar.Root>
						{#if user.Hireable}
							<span class="absolute -right-1 -top-1">
								<Badge class="bg-success">Hireable</Badge>
							</span>
						{/if}
					</div>

					<div>
						<h3 class="text-lg font-semibold">{user.FirstName} {user.LastName}</h3>
						<div class="text-sm text-muted-foreground">{user.Email}</div>
					</div>

					<div class="line-clamp-3 text-center text-sm">
						{user.Bio || 'No bio provided. Update your profile to add a bio.'}
					</div>

					<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
						<Calendar size="16" />
						<div>Joined {new Date(user.CreatedAt).toLocaleDateString()}</div>
					</div>

					<Button variant="outline" class="w-full" onclick={() => goto('/dashboard/profile')}>
						<PenLine size="16" class="mr-2" />
						Edit Profile
					</Button>
				</Card.Content>
			</Card.Root>

			<!-- Recent Applications -->
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title>Recent Applications</Card.Title>
					<Card.Description>Your most recent job applications</Card.Description>
				</Card.Header>
				<Card.Content class="p-0">
					{#if jobApplications.length === 0}
						<div class="px-6 py-12 text-center">
							<Info size="32" class="mx-auto mb-2 text-muted-foreground" strokeWidth={1.5} />
							<h4 class="font-medium">No applications yet</h4>
							<div class="text-sm text-muted-foreground">
								Start applying to see your applications here
							</div>
						</div>
					{:else}
						<div class="divide-y">
							{#each jobApplications as application}
								<div class="px-6 py-4 transition-colors hover:bg-slate-50">
									<div class="flex items-start justify-between">
										<div>
											<h4 class="truncate font-medium" title={application.Jobs?.Title}>
												{application.Jobs?.Title}
											</h4>
											<div class="text-sm text-muted-foreground">
												{@render nameof__job_creator(application.Users)}
											</div>
										</div>
										{#if application.JobApplications.Status === 'rejected'}
											<Badge variant="destructive">Rejected</Badge>
										{:else if application.JobApplications.Status === 'approved'}
											<Badge variant="default" class="bg-success">Approved</Badge>
										{:else if application.JobApplications.Draft === true}
											<Badge variant="outline">Draft</Badge>
										{:else}
											<Badge>Pending</Badge>
										{/if}
									</div>

									<div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
										<div class="flex items-center gap-1">
											<Briefcase size="14" />
											<span>{application.JobTypes?.Name || 'N/A'}</span>
										</div>
										<div class="flex items-center gap-1">
											<Clock3 size="14" />
											<span>{@render posted_relative_time(application)}</span>
										</div>
									</div>

									<div class="mt-3">
										{#if application.JobApplications.Draft && !application.Jobs?.Draft}
											<a href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}">
												<Button variant="secondary" size="sm" class="w-full"
													>Continue application</Button
												>
											</a>
										{:else if !application.JobApplications.Draft}
											<a href="/dashboard/jobs/apply?job_id={application.Jobs?.Id}">
												<Button variant="secondary" size="sm" class="w-full">View submission</Button
												>
											</a>
										{:else}
											<Button variant="secondary" size="sm" class="w-full" disabled
												>Not available</Button
											>
										{/if}
									</div>
								</div>
							{/each}
						</div>

						<div class="border-t p-4">
							<a href="/dashboard/submissions">
								<Button variant="ghost" class="w-full">View all applications</Button>
							</a>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Right section with available jobs -->
		<div class="md:col-span-5">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between">
					<div>
						<Card.Title class="text-xl">Available Jobs</Card.Title>
						<Card.Description
							>Browse jobs that match your skills and interests (newest are displayed first)</Card.Description
						>
					</div>

					<div class="hidden md:block">
						{@render jobs_paginator()}
					</div>
				</Card.Header>

				<Card.Content>
					{#if jobs.length === 0}
						<div class="py-12 text-center">
							<Info size="48" class="mx-auto mb-3 text-muted-foreground" strokeWidth={1.5} />
							<h3 class="text-lg font-medium">No jobs available</h3>
							<div class="text-muted-foreground">Check back later for new opportunities</div>
						</div>
					{:else}
						<div class="grid gap-4">
							{#each jobs as job}
								<div
									class="rounded-lg border p-5 transition-colors hover:border-primary/20 hover:bg-accent/10"
								>
									<div class="flex flex-wrap justify-between gap-4">
										<div class="min-w-0 flex-1">
											<h3 class="truncate text-lg font-medium" title={job.Jobs.Title}>
												{job.Jobs.Title}
											</h3>

											<div class="mt-2 flex flex-wrap gap-4">
												<div class="flex items-center gap-1">
													<Building size="16" class="text-muted-foreground" />
													<span class="text-sm"
														>{@render nameof__job_creator(
															job.Users as unknown as IJobCreator
														)}</span
													>
												</div>

												<div class="flex items-center gap-1">
													<DollarSign size="16" class="text-muted-foreground" />
													<span class="text-sm">${job.Jobs.MinRate} - ${job.Jobs.MaxRate}/hr</span>
												</div>

												<div class="flex items-center gap-1">
													<Briefcase size="16" class="text-muted-foreground" />
													<span class="text-sm">{job.JobTypes?.Name}</span>
												</div>

												<div class="flex items-center gap-1">
													<Clock3 size="16" class="text-muted-foreground" />
													<span class="text-sm">{@render posted_relative_time(job)}</span>
												</div>
											</div>

											<div class="mt-4">
												<div class="line-clamp-2 text-sm text-muted-foreground">
													{job.Jobs.Description?.replace(/<[^>]*>/g, '').slice(0, 150)}...
												</div>
											</div>
										</div>

										<div class="flex flex-col items-end justify-between">
											{#if job.Jobs.Draft !== undefined && !job.Jobs.Draft}
												<Badge variant="outline" class="mb-auto">Active</Badge>
											{/if}

											<a href="/dashboard/jobs/view/{job.Jobs.Id}">
												<Button>
													Apply Now
													<ExternalLink size="14" class="ml-1" />
												</Button>
											</a>
										</div>
									</div>
								</div>
							{/each}
						</div>

						<div class="mt-6 flex justify-center md:hidden">
							{@render jobs_paginator()}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>

{#snippet jobs_paginator()}
	<Pagination.Root count={pages_length} perPage={page_items_per_page} page={offset}>
		{#snippet children({ pages, currentPage })}
			<Pagination.Content>
				<Pagination.Item>
					<a href="/dashboard?page={currentPage < 1 ? 1 : currentPage}" data-sveltekit-reload
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
							<a href="/dashboard?page={page.value}" data-sveltekit-reload>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link></a
							>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<a
						href="/dashboard?page={currentPage > page_count ? page_count : currentPage}"
						data-sveltekit-reload><Pagination.NextButton /></a
					>
				</Pagination.Item>
			</Pagination.Content>
		{/snippet}
	</Pagination.Root>
{/snippet}
