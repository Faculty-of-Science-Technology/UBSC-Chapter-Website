<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Tabs from '$lib/components/vendor/ui/tabs';
	import { nameof__job_creator } from '$lib/snippets/names';
	import { type IJobCreator } from '$lib/snippets/names/index.svelte';
	import { posted_relative_time } from '$lib/snippets/time/index';
	import {
		ArrowLeft,
		Briefcase,
		Calendar,
		Clock3,
		Coins,
		DollarSign,
		FileText,
		MapPin,
		Share2
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data: props } = $props();
	const data: PageData = props;
	const job_obj = data.job;
	const job = job_obj.Jobs;
	const job_type = job_obj.JobTypes;
	const job_creator = job_obj.Users;
	const jobs = data.jobs;
	const user = data.user;

	// Format salary to display with commas
	function formatSalary(amount: number): string {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	// Format date from timestamp
	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Generate placeholder company logo from name
	function generateLogoPlaceholder(name: string): string {
		return name.substring(0, 2).toUpperCase();
	}

	// Share job functionality
	function shareJob() {
		if (navigator.share) {
			navigator.share({
				title: job.Title,
				text: `Check out this job: ${job.Title}`,
				url: window.location.href
			});
		} else {
			// Fallback - copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	}
</script>

<div class="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
	<!-- Breadcrumb and actions -->
	<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
		<div>
			<div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
				<a href="/dashboard" class="hover:underline">Dashboard</a>
				<span>/</span>
				<a href="/dashboard/jobs" class="hover:underline">Jobs</a>
				<span>/</span>
				<span class="text-foreground font-medium">View Job</span>
			</div>
			<h1 class="text-3xl font-bold tracking-tight">{job.Title}</h1>
		</div>

		<div class="flex flex-wrap gap-2">
			<Button variant="outline" size="sm" class="gap-2" onclick={() => history.back()}>
				<ArrowLeft size={16} />
				Back
			</Button>

			{#if job.UserId === user.Id}
				<a href="/dashboard/jobs/new?job_id={job.Id}">
					<Button variant="outline" size="sm" class="gap-2">
						<FileText size={16} />
						Edit job
					</Button>
				</a>

				<a href="/dashboard/jobs/applicants?job_id={job.Id}">
					<Button variant="outline" size="sm" class="gap-2">
						<Briefcase size={16} />
						View applicants
					</Button>
				</a>
			{/if}

			<Button variant="ghost" size="sm" class="gap-2" onclick={shareJob}>
				<Share2 size={16} />
				Share
			</Button>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main content area - Job details -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Company info card -->
			<div class="flex gap-4 items-center p-6 bg-white rounded-lg border">
				<div class="flex-shrink-0">
					{#if job_creator?.ProfilePicture}
						<Avatar.Root class="h-14 w-14">
							<Avatar.Image src={job_creator.ProfilePicture} alt={job_creator?.FirstName + ' ' + job_creator?.LastName} />
							<Avatar.Fallback>{generateLogoPlaceholder(job_creator?.FirstName || 'C')}</Avatar.Fallback>
						</Avatar.Root>
					{:else}
						<div class="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary font-semibold">
							{generateLogoPlaceholder(job_creator?.FirstName || 'C')}
						</div>
					{/if}
				</div>

				<div>
					<h2 class="text-lg font-semibold">{job_creator?.FirstName + ' ' + job_creator?.LastName}</h2>
					<p class="text-sm text-muted-foreground">
						{job_creator?.Bio ? job_creator.Bio.substring(0, 100) + (job_creator.Bio.length > 100 ? '...' : '') : 'No description available'}
					</p>

					<div class="flex gap-2 mt-2">
						<a href="/dashboard/organizations/{job_creator?.Id}">
							<Button variant="outline" size="sm">View Company</Button>
						</a>
					</div>
				</div>
			</div>

			<!-- Job details tabs -->
			<Card.Root>
				<Tabs.Root value="description" class="w-full">
					<Tabs.List class="border-b px-4">
						<Tabs.Trigger value="description" class="data-[state=active]:border-primary">Description</Tabs.Trigger>
						<Tabs.Trigger value="details" class="data-[state=active]:border-primary">Job Details</Tabs.Trigger>
					</Tabs.List>

					<!-- Job Description Tab -->
					<Tabs.Content value="description" class="p-6">
						<div class="prose prose-slate max-w-none">
							{@html job.Description}
						</div>

						<div class="mt-8">
							<a href="/dashboard/jobs/apply?job_id={job.Id}">
								<Button size="lg">Apply for this job</Button>
							</a>
						</div>
					</Tabs.Content>

					<!-- Job Details Tab -->
					<Tabs.Content value="details" class="space-y-6 p-6">
						<div class="grid gap-6 md:grid-cols-2">
							<Card.Root>
								<Card.Header class="pb-3">
									<Card.Title class="text-base">Salary Range</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="flex items-center gap-2 text-2xl font-semibold">
										<Coins size={20} className="text-muted-foreground" />
										<span>${formatSalary(job.MinRate)} - ${formatSalary(job.MaxRate)}/hr</span>
									</div>
								</Card.Content>
							</Card.Root>

							<Card.Root>
								<Card.Header class="pb-3">
									<Card.Title class="text-base">Job Type</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="flex items-center gap-2 text-2xl font-semibold">
										<Briefcase size={20} className="text-muted-foreground" />
										<span>{job_type?.Name || 'Not specified'}</span>
									</div>
								</Card.Content>
							</Card.Root>

							<Card.Root>
								<Card.Header class="pb-3">
									<Card.Title class="text-base">Posted</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="flex items-center gap-2">
										<Calendar size={20} className="text-muted-foreground" />
										<div>
											<div class="text-lg font-semibold">{formatDate(job.CreatedAt)}</div>
											<div class="text-sm text-muted-foreground">{@render posted_relative_time(job_obj)}</div>
										</div>
									</div>
								</Card.Content>
							</Card.Root>

							<Card.Root>
								<Card.Header class="pb-3">
									<Card.Title class="text-base">Location</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="flex items-center gap-2">
										<MapPin size={20} className="text-muted-foreground" />
										<span class="text-lg font-semibold">{job_creator?.Location || 'Remote/Not specified'}</span>
									</div>
								</Card.Content>
							</Card.Root>
						</div>

						{#if job.UserId !== user.Id}
							<div class="pt-4">
								<a href="/dashboard/jobs/apply?job_id={job.Id}">
									<Button size="lg" class="w-full">Apply for this job</Button>
								</a>
							</div>
						{/if}
					</Tabs.Content>
				</Tabs.Root>
			</Card.Root>

			<!-- Keywords/Skills Required -->
			<!-- {#if job.Tags && job.Tags.length > 0}
				<Card.Root>
					<Card.Header>
						<Card.Title>Skills & Requirements</Card.Title>
						<Card.Description>Keywords associated with this position</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="flex flex-wrap gap-2">
							{#each job.Tags as tag}
								<Badge variant="secondary">{tag}</Badge>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			{/if} -->
		</div>

		<!-- Sidebar - Similar Jobs -->
		<div>
			<Card.Root>
				<Card.Header>
					<Card.Title>More Jobs</Card.Title>
					<Card.Description>Other opportunities you might be interested in</Card.Description>
				</Card.Header>
				<Card.Content class="p-0">
					{#if jobs.length === 0}
						<div class="py-8 text-center">
							<div class="text-muted-foreground">No other jobs are currently available</div>
						</div>
					{:else}
						<div class="divide-y">
							{#each jobs.slice(0, 5) as job, i}
								{#if job.Jobs.Id !== job_obj.Jobs.Id}
									<a
										href="/dashboard/jobs/view/{job.Jobs.Id}"
										class="block p-4 hover:bg-accent/20 transition-colors"
									>
										<div class="flex justify-between mb-1">
											<h3 class="font-medium line-clamp-1">{job.Jobs.Title}</h3>
											{#if job.Jobs.Draft === undefined || job.Jobs.Draft === true}
												<Badge variant="outline">Draft</Badge>
											{:else}
												<Badge variant="secondary">Active</Badge>
											{/if}
										</div>
										<div class="text-sm text-muted-foreground mb-2">{@render nameof__job_creator(job.Users as IJobCreator)}</div>

										<div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
											<div class="flex items-center gap-1">
												<DollarSign size={12} />
												<span>${job.Jobs.MinRate} - ${job.Jobs.MaxRate}/hr</span>
											</div>

											<div class="flex items-center gap-1">
												<Briefcase size={12} />
												<span>{job.JobTypes?.Name || 'Not specified'}</span>
											</div>

											<div class="flex items-center gap-1">
												<Clock3 size={12} />
												<span>{@render posted_relative_time(job)}</span>
											</div>
										</div>
									</a>
								{/if}
							{/each}
						</div>

						{#if jobs.length > 5}
							<div class="p-4 border-t">
								<a href="/dashboard">
									<Button variant="ghost" class="w-full">View all jobs</Button>
								</a>
							</div>
						{/if}
					{/if}
				</Card.Content>
			</Card.Root>

			{#if job.UserId !== user.Id}
				<div class="mt-6 sticky top-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Ready to Apply?</Card.Title>
							<Card.Description>Take the next step in your career</Card.Description>
						</Card.Header>
						<Card.Content>
							<a href="/dashboard/jobs/apply?job_id={job.Id}">
								<Button class="w-full">Apply for this job</Button>
							</a>

							<div class="mt-4 text-sm text-muted-foreground">
								<div>Applying is quick and easy. We'll guide you through the process step-by-step.</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			{/if}
		</div>
	</div>
</div>
