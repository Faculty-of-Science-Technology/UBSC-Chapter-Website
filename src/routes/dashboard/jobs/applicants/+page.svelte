<script lang="ts">
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button, buttonVariants } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Dialog from '$lib/components/vendor/ui/dialog/';
	import { Input } from '$lib/components/vendor/ui/input';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Pagination from '$lib/components/vendor/ui/pagination';
	import Textarea from '$lib/components/vendor/ui/textarea/textarea.svelte';
	import { cn } from '$lib/components/vendor/utils.js';
	import { nameof__job_creator } from '$lib/snippets/names/index';
	import { posted_relative_time } from '$lib/snippets/time/index';
	import { Briefcase, Clock3, DollarSign } from 'lucide-svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;

	const dataLength = data.dataLength;

	const jobApplications = data.jobApplications; // typeof (optional)
	const job = data.job; // typeof (optional)
	const jobs = data.jobs; // typeof (optional)

	let current_applicant: string = $state(''); // typeof (optional)
	const {
		form: responseForm,
		constraints: responseConstraints,
		enhance: responseEnhance,
		errors: responseErrors,
		message: responseMessage
	} = superForm(data.messageForm, {
		resetForm: false,
		invalidateAll: false,
		// onUpdated(event) {
		// 	console.log(event);
		// },
		// onSubmit(input) {
		// 	console.log(input);
		// },
		onResult(result_) {
			const result = result_.result;
			// console.log(result);
			// F***ing hack since the result is not being outputted
			try {
				$responseErrors = result.data?.messageForm.errors;
			} catch (e) {
				console.log(e);
			}
			try {
				$responseMessage = result.data?.form.message;
			} catch {
				// Ignored
			}
		}
		//dataType: 'json'
	});

	const {
		form: declineForm,
		constraints: declineConstraints,
		enhance: declineEnhance,
		errors: declineErrors,
		message: declineMessage
	} = superForm(data.declineForm, {
		resetForm: false,
		invalidateAll: false,
		onResult(result_) {
			const result = result_.result;
			// console.log(result);
			// F***ing hack since the result is not being outputted
			try {
				$responseErrors = result.data?.declineForm.errors;
			} catch (e) {
				console.log(e);
			}
			try {
				$responseMessage = result.data?.form.message;
			} catch {
				// Ignored
			}
		}
		//		dataType: 'json'
	});

	const offset = data.offset;

	// Get the amount of pages from the jobs length
	const page_count = Math.ceil(dataLength / 10);

	// import * as m from '$lib/paraglide/messages.js';
</script>

<SuperDebug data={$responseForm} />
<SuperDebug data={$declineForm} />
<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">
			{jobApplications
				? 'Applications For: ' + (job?.Title ?? jobApplications[0]?.Jobs?.Title)
				: 'Job Applications'}
		</h1>
		<p class="text-lg lg:text-2xl">View and manage submissions</p>
	</section>
	<main
		class="text-inter relative flex h-fit flex-col flex-wrap items-start gap-8 self-stretch lg:flex-row"
	>
		<!-- Left Column -->
		<!-- <l-column class="top-20 flex flex-col items-start gap-6 lg:sticky lg:w-fit">
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
						<h1>{!jobApplications ? 'Select a job to view submission data' : 'Submission data'}</h1>
						{@render job_paginator({ centered: false })}
					</div>
				</Card.Title>
			</Card.Root>
			{#if dataLength === 0}
				<Card.Root class="w-full">
					<Card.Title class="items-center justify-center pb-2 pt-3 text-center text-2xl">
						<h1>There isn't any data to show for this</h1>
					</Card.Title>
					<Card.Description class="pb-4 text-center">
						<p>Try viewing something else?</p>
					</Card.Description>
				</Card.Root>
			{/if}
			{#if jobs}
				{#each jobs as job}
					<JobCard.Root class="w-full">
						<JobCard.Content class="flex flex-col gap-4">
							<JobCard.Title class="flex flex-col gap-2">
								<h2>{job.Jobs.Title}</h2>
								<span class="tracking-wide"
									><Badge
										>{job.Jobs.Draft === undefined
											? 'Draft (Unsaved)'
											: job.Jobs.Draft === true
												? 'Draft (Saved)'
												: 'Live'}</Badge
									></span
								>
							</JobCard.Title>
							<card-description class="flex flex-col gap-6">
								<div class="flex flex-col gap-2">
									<JobCard.Description
										>{job.Users?.FirstName + ' ' + job.Users?.LastName}</JobCard.Description
									>
									<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
										<DollarSign strokeWidth="2" size="16" />
										<p>${job.Jobs.MinRate}/hr &ndash; ${job.Jobs.MaxRate}/hr</p>
									</div>
									<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
										<Briefcase strokeWidth="2" size="16" />
										<p>{job.JobTypes?.Name}</p>
									</div>
									<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
										<Clock3 strokeWidth="2" size="16" />
										{@render posted_relative_time(job)}
									</div>
								</div>
								<div class="flex gap-3">
									{#if job.Jobs.Draft === undefined}
										<Button class="w-fit" disabled>Undraft job to view submissions</Button>
									{:else if job.Jobs.Draft === true}
										<Button class="w-fit" disabled>Undraft job to view submissions</Button>
									{:else}
										<a href="/dashboard/jobs/applicants?job_id={job.Jobs.Id}" data-sveltekit-reload>
											<Button class="w-fit">View submission data</Button></a
										>
									{/if}
								</div>
							</card-description>
						</JobCard.Content>
					</JobCard.Root>
				{/each}
			{/if}
			{#if jobApplications !== undefined}
				{#each jobApplications as application}
					<JobCard.Root class="w-full">
						<JobCard.Content class="flex flex-col gap-4">
							<JobCard.Title>
								<h2>{@render nameof__job_creator(application.Users)}</h2>
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
							</JobCard.Title>
							<card-description class="flex flex-col gap-2">
								<JobCard.Description>{application.Jobs?.Title}</JobCard.Description>
								<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
									<Briefcase strokeWidth="2" size="16" />
									<p>{application.JobTypes?.Name}</p>
								</div>
								<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
									<Clock3 strokeWidth="2" size="16" />
									<p>{@render posted_relative_time(application)}</p>
								</div>

								{#if application.JobApplications.Draft === undefined && !application.Jobs?.Draft}
									<Button
										class="w-full lg:w-fit"
										disabled
										title="You can review this once the applicant is finished with it."
										>Drafting</Button
									>
								{:else if application.JobApplications.Draft === true && !application.Jobs?.Draft}
									<Button
										class="w-full lg:w-fit"
										disabled
										title="You can review this once the applicant is finished with it."
										>Drafting</Button
									>
								{:else if application.JobApplications.Draft === true && application.Jobs?.Draft}
									<a
										class="w-fit cursor-not-allowed select-none"
										href="#frozen"
										title="You have to undraft this job for the applicant to continue applying"
										><Button class="w-full" disabled>Frozen</Button></a
									>
								{:else}
									<div class="flex gap-3">
										<a
											class="w-fit"
											href="/dashboard/jobs/apply?job_id={application.Jobs
												?.Id}&application_id={application.JobApplications.Id}"
											><Button class="w-full">View submission</Button></a
										>

										<Dialog.Root>
											<Dialog.Trigger
												onclick={() => {
													console.log(application);
													current_applicant = application.JobApplications.Id as string;
												}}
												class={cn(buttonVariants({ variant: 'secondary' }), 'w-fit')}
												>Follow-up</Dialog.Trigger
											>
											<Dialog.Content class="sm:max-w-[425px]">
												<form
													id="responseForm"
													method="POST"
													action="?/sendResponse"
													use:responseEnhance
												>
													<Dialog.Header>
														<Dialog.Title>Send a message</Dialog.Title>
														<Dialog.Description>
															Send a follow-up message to the applicant's email. They can reply
															directly to your email, allowing you to communicate seamlessly with
															them.
														</Dialog.Description>
													</Dialog.Header>
													<div class="flex flex-col gap-6 py-4">
														<div class="flex flex-col items-start justify-start gap-2">
															<Label for="name" class="text-right">Your name</Label>
															<Input
																id="name"
																name="response_name"
																bind:value={$responseForm.response_name}
																placeholder="This is what will be shown in the 'to:' section of the email"
															/>
															<p class="text-sm text-red-600">{$responseErrors.response_name}</p>
														</div>
														<div class="flex flex-col items-start justify-start gap-2">
															<Label for="message" class="text-right">Message</Label>
															<Textarea
																id="message"
																name="response_message"
																bind:value={$responseForm.response_message as string}
																placeholder="This is what will be shown in the body of the email"
															/>
															<p class="text-sm text-red-600">{$responseErrors.response_message}</p>
														</div>
													</div>
													<Dialog.Footer class="block space-x-0 space-y-1 text-left sm:space-x-0">
														<input type="hidden" name="application_id" value={current_applicant} />
														<p class="text-sm text-red-600">{$responseErrors.application_id}</p>
														{#if $responseMessage != undefined}
															<p class="text-sm text-emerald-600">
																{'✓' + ' ' + $responseMessage}
															</p>
														{/if}
														<Button type="submit">Accept & Follow-up</Button>
													</Dialog.Footer>
												</form>
											</Dialog.Content>
										</Dialog.Root>

										<Dialog.Root>
											<Dialog.Trigger
												class={cn(buttonVariants({ variant: 'destructive' }), 'w-fit')}
												onclick={() => {
													console.log(application);
													current_applicant = application.JobApplications.Id as string;
												}}>Reject</Dialog.Trigger
											>
											<Dialog.Content class="sm:max-w-[425px]">
												<form id="declineForm" method="POST" action="?/decline" use:declineEnhance>
													<Dialog.Header>
														<Dialog.Title
															>Delete '{application.Jobs?.Title}' from '{application.Users
																?.FirstName +
																' ' +
																application.Users?.LastName}'</Dialog.Title
														>
														<Dialog.Description>
															You won't be able to retrieve it again. Are you sure you want to
															delete it?
														</Dialog.Description>
													</Dialog.Header>
													<div class="flex flex-col gap-6 py-4">
														<div class="flex flex-col items-start justify-start gap-2">
															<Label for="reason" class="text-right"
																>Reason for rejection (optional)</Label
															>
															<Textarea
																id="reason"
																name="decline_reason"
																bind:value={$declineForm.decline_reason as string}
																placeholder="This is what will be shown in the body of the email"
															/>
														</div>
														<Dialog.Footer class="block space-x-0 space-y-1 text-left sm:space-x-0">
															<input
																type="hidden"
																name="application_id"
																value={current_applicant}
															/>
															<p class="text-sm text-red-600">{$responseErrors.application_id}</p>
															{#if $responseMessage != undefined}
																<p class="text-sm text-emerald-600">
																	{'✓' + ' ' + $responseMessage}
																</p>
															{/if}
															<Button
																type="submit"
																class="bg-destructive"
																onclick={() => {
																	setTimeout(() => {
																		window.location.href = '/dashboard/jobs/applicants';
																	}, 3000);
																}}>Reject & Delete</Button
															>
														</Dialog.Footer>
													</div>
												</form>
											</Dialog.Content>
										</Dialog.Root>
									</div>
								{/if}
							</card-description>
						</JobCard.Content>
					</JobCard.Root>
				{/each}
			{/if}
			{@render job_paginator({ centered: true })}
			{#snippet job_paginator({ centered }: { centered: boolean })}
				<Pagination.Root {centered} count={dataLength} perPage={10} page={offset}>
					{#snippet children({ pages, currentPage })}
						<Pagination.Content>
							<Pagination.Item>
								<a
									href="/dashboard/jobs/applicants?page={currentPage < 1 ? 1 : currentPage}"
									data-sveltekit-reload><Pagination.PrevButton /></a
								>
							</Pagination.Item>
							{#each pages as page (page.key)}
								{#if page.type === 'ellipsis'}
									<Pagination.Item>
										<Pagination.Ellipsis />
									</Pagination.Item>
								{:else}
									<Pagination.Item>
										<a href="/dashboard/jobs/applicants?page={page.value}" data-sveltekit-reload>
											<Pagination.Link {page} isActive={currentPage === page.value}>
												{page.value}
											</Pagination.Link></a
										>
									</Pagination.Item>
								{/if}
							{/each}
							<Pagination.Item>
								<a
									href="/dashboard/jobs/applicants?page={currentPage > page_count
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
