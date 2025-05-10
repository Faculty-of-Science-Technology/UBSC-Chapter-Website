<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as RadioGroup from '$lib/components/vendor/ui/radio-group';
	import { Separator } from '$lib/components/vendor/ui/separator';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import * as Tabs from '$lib/components/vendor/ui/tabs';
	import { cn } from '$lib/components/vendor/utils';
	import { nameof__job_creator } from '$lib/snippets/names/index';
	import { posted_relative_time } from '$lib/snippets/time/index';

	import { type IJobCreator } from '$lib/snippets/names/index.svelte';
	import {
		ArrowLeft,
		Briefcase,
		CheckCircle2,
		Clock3,
		Coins,
		FileQuestion,
		FileText,
		Loader2,
		MapPin,
		Save,
		Send,
		Upload,
		User
	} from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types.js';

	let isDragOver = $state(false);
	let emailSwitch: Switch;
	let activeTab = $state('details');

	let { data: props } = $props();
	const data: PageData = props;
	const user = data.user;
	const reviewing = data.reviewing;

	const job_obj = data.job;
	const job = job_obj.Jobs;
	const job_type = job_obj.JobTypes;
	const job_creator = job_obj.Users;

	const questions = data.questions;

	const application_form = data.applicationForm;
	const application_id = data.applicationId;
	const application_status = data.applicationStatus;

	// Pre-populate form with user data
	application_form.data.first_name = user.FirstName;
	application_form.data.last_name = user.LastName;

	// Initialize question responses if needed
	if (application_form.data.question_response_array.length !== questions.length) {
		application_form.data.question_response_array = questions.map((question) => ({
			question_id: question.Id,
			response: ''
		}));
	}

	const { form, constraints, enhance, errors } = superForm(data.applicationForm, {
		resetForm: false,
		invalidateAll: false,
		dataType: 'json'
	});

	function toggleEmail(checked: boolean) {
		$form.email = checked ? user.Email : $form.email;
	}

	// Format salary with commas
	function formatSalary(amount: number): string {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	// Function to create user initials for avatar
	function getInitials(firstName: string, lastName: string): string {
		return (firstName?.[0] || '') + (lastName?.[0] || '');
	}

	// Generate status badge style based on application status
	function getStatusBadgeClass(status: string): string {
		switch (status) {
			case 'draft':
				return 'bg-amber-100 text-amber-800 border-amber-200';
			case 'pending':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'approved':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'rejected':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	// Format status for display
	function formatStatus(status: string): string {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}

	// Status label and class
	const statusClass = getStatusBadgeClass(application_status || 'draft');
	const statusLabel = formatStatus(application_status || 'Draft');
</script>

<div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header section with breadcrumbs -->
	<div class="mb-8 flex flex-col gap-2">
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<a href="/dashboard" class="hover:underline">Dashboard</a>
			<span>/</span>
			<a href="/dashboard/jobs" class="hover:underline">Jobs</a>
			<span>/</span>
			<a href="/dashboard/jobs/view/{job.Id}" class="hover:underline">Job Details</a>
			<span>/</span>
			<span class="font-medium text-foreground">Apply</span>
		</div>

		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight">{job.Title}</h1>
				<p class="text-muted-foreground">
					{@render nameof__job_creator(job_creator as IJobCreator)}
				</p>
			</div>

			{#if application_status}
				<div class={cn('rounded-full border px-3 py-1 text-sm font-medium', statusClass)}>
					{statusLabel}
				</div>
			{/if}
		</div>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Main content area - Application form -->
		<div class="space-y-6 lg:col-span-2">
			<form
				enctype="multipart/form-data"
				method="POST"
				action="?/createApplication"
				use:enhance
				class="space-y-8"
			>
				<!-- Application tabs -->
				<Card.Root>
					<Tabs.Root value={activeTab} onValueChange={(v) => (activeTab = v)} class="w-full">
						<Tabs.List class="border-b px-4">
							<Tabs.Trigger value="details" class="flex gap-2 data-[state=active]:border-primary">
								<User size={16} />
								Personal Details
							</Tabs.Trigger>
							{#if questions.length > 0}
								<Tabs.Trigger
									value="questions"
									class="flex gap-2 data-[state=active]:border-primary"
								>
									<FileQuestion size={16} />
									Additional Questions {questions.length > 0 ? `(${questions.length})` : ''}
								</Tabs.Trigger>
							{/if}
							<Tabs.Trigger value="review" class="flex gap-2 data-[state=active]:border-primary">
								<CheckCircle2 size={16} />
								Review & Submit
							</Tabs.Trigger>
						</Tabs.List>

						<!-- Personal Details Tab -->
						<Tabs.Content value="details" class="space-y-6 p-6">
							<!-- Profile information -->
							<div class="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
								<Avatar.Root class="h-16 w-16">
									<Avatar.Image
										src={user.ProfilePicture}
										alt={user.FirstName + ' ' + user.LastName}
									/>
									<Avatar.Fallback>{getInitials(user.FirstName, user.LastName)}</Avatar.Fallback>
								</Avatar.Root>

								<div>
									<h3 class="text-lg font-medium">{user.FirstName} {user.LastName}</h3>
									<p class="text-muted-foreground">{user.Email}</p>
									<div class="mt-2">
										<a
											href="/dashboard/settings"
											class="inline-flex items-center gap-1 text-sm text-primary hover:underline"
										>
											Edit profile information
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
											>
										</a>
									</div>
								</div>
							</div>

							<div class="space-y-4">
								<!-- Contact info -->
								<h3 class="text-lg font-medium">Contact Information</h3>

								<!-- Phone Number -->
								<div class="grid gap-2">
									<Label for="mphone-number" class="text-sm font-medium">
										Mobile phone number <span class="text-destructive">*</span>
									</Label>
									<Input
										type="tel"
										id="mphone-number"
										placeholder="Enter your mobile phone number"
										bind:value={$form.phone}
										{...$constraints.phone}
										disabled={!$form.draft}
										class="max-w-md"
									/>
									{#if $errors.phone}
										<p class="text-sm text-destructive">{$errors.phone}</p>
									{/if}
								</div>

								<!-- Email Address -->
								<div class="grid gap-2">
									<Label for="email" class="text-sm font-medium">
										Email address <span class="text-destructive">*</span>
									</Label>
									<Input
										type="email"
										id="email"
										placeholder="Enter your email address"
										onblur={(e) => {
											const event = e as FocusEvent;
											const target = event.target as HTMLInputElement;
											if (target.value !== user.Email) {
												emailSwitch.checked = false;
											} else {
												emailSwitch.checked = true;
											}
										}}
										bind:value={$form.email}
										{...$constraints.email}
										disabled={!$form.draft}
										class="max-w-md"
									/>
									<div class="mt-1 flex items-center gap-2">
										<Switch
											bind:this={emailSwitch}
											onCheckedChange={toggleEmail}
											id="email-alt"
											disabled={!$form.draft}
										/>
										<Label for="email-alt" class="cursor-pointer text-sm font-normal">
											Use email from my profile
										</Label>
									</div>
									{#if $errors.email}
										<p class="text-sm text-destructive">{$errors.email}</p>
									{/if}
								</div>

								<!-- Resume Upload -->
								<div class="grid gap-2">
									<Label for="resume" class="text-sm font-medium">
										Resume <span class="text-destructive">*</span>
									</Label>
									<div
										class={cn(
											'flex flex-col items-center justify-center rounded-md border border-dashed p-8 transition-colors',
											isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
											!$form.draft && 'pointer-events-none opacity-70'
										)}
									>
										<input
											id="resume"
											type="file"
											name="resume"
											class="hidden"
											oninput={(e) => ($form.resume = e.currentTarget.files?.item(0) as File)}
											{...$constraints.resume}
											ondragenter={() => (isDragOver = true)}
											ondragleave={() => (isDragOver = false)}
											ondrop={() => (isDragOver = false)}
											disabled={!$form.draft}
										/>

										<div class="flex flex-col items-center gap-2">
											<Upload class="h-8 w-8 text-muted-foreground" />
											<div>
												<p class="text-center font-medium">
													Drag & drop your resume or click to browse
												</p>
												<p class="mt-1 text-center text-xs text-muted-foreground">
													PDF, DOCX or TXT (Max 5MB)
												</p>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												class="mt-2"
												onclick={() => document.getElementById('resume')?.click()}
												disabled={!$form.draft}
											>
												Select file
											</Button>
										</div>
									</div>

									{#if reviewing === false && application_form.data.draft && application_status === 'pending'}
										<div class="mt-2 flex items-center gap-2 text-sm">
											<FileText class="h-4 w-4 text-muted-foreground" />
											<a
												href="/backend/resume?applicationID={application_id}"
												target="_blank"
												class="font-medium hover:text-primary hover:underline"
											>
												Review uploaded resume
											</a>
										</div>
									{:else if reviewing}
										<div class="mt-2 flex items-center gap-2 text-sm">
											<FileText class="h-4 w-4 text-muted-foreground" />
											<a
												href="/backend/resume?applicationID={application_id}"
												target="_blank"
												class="font-medium hover:text-primary hover:underline"
											>
												View uploaded resume
											</a>
										</div>
									{/if}

									{#if $errors.resume}
										<p class="text-sm text-destructive">{$errors.resume}</p>
									{/if}
								</div>

								<!-- Notice Period -->
								<div class="grid gap-2">
									<Label for="notice-period" class="text-sm font-medium">
										Notice period (in days) <span class="text-destructive">*</span>
									</Label>
									<Input
										type="number"
										id="notice-period"
										bind:value={$form.notice_period}
										placeholder="Enter your notice period in days (e.g., 30)"
										disabled={!$form.draft}
										class="max-w-md"
									/>
									{#if $errors.notice_period}
										<p class="text-sm text-destructive">{$errors.notice_period}</p>
									{/if}
								</div>
							</div>

							{#if questions.length > 0}
								<div class="flex justify-end pt-4">
									<Button
										type="button"
										variant="outline"
										class="gap-2"
										onclick={() => (activeTab = 'questions')}
									>
										Continue to Additional Questions
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
										>
									</Button>
								</div>
							{:else}
								<div class="flex justify-end pt-4">
									<Button
										type="button"
										variant="outline"
										class="gap-2"
										onclick={() => (activeTab = 'review')}
									>
										Review Application
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
										>
									</Button>
								</div>
							{/if}
						</Tabs.Content>

						<!-- Additional Questions Tab -->
						{#if questions.length > 0}
							<Tabs.Content value="questions" class="space-y-6 p-6">
								<div class="mb-4">
									<h3 class="text-lg font-medium">Additional Questions</h3>
									<p class="text-muted-foreground">
										Please answer the following questions from the employer
									</p>
								</div>

								<div class="space-y-8">
									{#each questions as question, index}
										<div class="rounded-lg border p-4">
											<div class="space-y-4">
												{#if question.Type === true}
													<!-- Short Answer Question -->
													<Label class="text-base font-medium"
														>{index + 1}. {question.Content}
														<span class="text-destructive">*</span></Label
													>
													<Input
														type="text"
														name="question_response"
														placeholder="Enter your answer"
														bind:value={$form.question_response_array[index].response}
														{...$constraints.question_response_array}
														disabled={!$form.draft}
													/>
													{#if $errors.question_response_array?.[index]?.response}
														<p class="text-sm text-destructive">
															{$errors.question_response_array[index].response}
														</p>
													{/if}
												{:else}
													<!-- Yes/No Question -->
													<Label class="text-base font-medium"
														>{index + 1}. {question.Content}
														<span class="text-destructive">*</span></Label
													>
													<RadioGroup.Root
														name="question_response"
														onValueChange={(value) =>
															($form.question_response_array[index].response = value)}
														bind:value={$form.question_response_array[index].response}
														class="mt-2 space-y-2"
													>
														<div class="flex items-center gap-2">
															<RadioGroup.Item
																value="YES"
																id={`yes-${index}`}
																disabled={!$form.draft}
															/>
															<Label for={`yes-${index}`} class="cursor-pointer font-normal"
																>Yes</Label
															>
														</div>
														<div class="flex items-center gap-2">
															<RadioGroup.Item
																value="NO"
																id={`no-${index}`}
																disabled={!$form.draft}
															/>
															<Label for={`no-${index}`} class="cursor-pointer font-normal"
																>No</Label
															>
														</div>
													</RadioGroup.Root>
													{#if $errors.question_response_array?.[index]?.response}
														<p class="text-sm text-destructive">
															{$errors.question_response_array[index].response}
														</p>
													{/if}
												{/if}
											</div>
										</div>
									{/each}
								</div>

								<div class="flex justify-between pt-4">
									<Button
										type="button"
										variant="ghost"
										class="gap-2"
										onclick={() => (activeTab = 'details')}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
										>
										Back to Details
									</Button>

									<Button
										type="button"
										variant="outline"
										class="gap-2"
										onclick={() => (activeTab = 'review')}
									>
										Review Application
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
										>
									</Button>
								</div>
							</Tabs.Content>
						{/if}

						<!-- Review & Submit Tab -->
						<Tabs.Content value="review" class="space-y-6 p-6">
							<div>
								<h3 class="text-lg font-medium">Review Your Application</h3>
								<p class="text-muted-foreground">
									Please review all the information before submitting your application
								</p>
							</div>

							<!-- Personal Details Review -->
							<div>
								<h4
									class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
								>
									Personal Details
								</h4>
								<div class="space-y-4 rounded-lg border bg-muted/30 p-4">
									<div class="grid gap-1">
										<p class="text-sm text-muted-foreground">Full Name</p>
										<p class="font-medium">{user.FirstName} {user.LastName}</p>
									</div>

									<Separator />

									<div class="grid gap-1">
										<p class="text-sm text-muted-foreground">Email Address</p>
										<p class="font-medium">{$form.email}</p>
									</div>

									<Separator />

									<div class="grid gap-1">
										<p class="text-sm text-muted-foreground">Phone Number</p>
										<p class="font-medium">{$form.phone || 'Not provided'}</p>
									</div>

									<Separator />

									<div class="grid gap-1">
										<p class="text-sm text-muted-foreground">Notice Period</p>
										<p class="font-medium">{$form.notice_period} days</p>
									</div>

									<Separator />

									<div class="grid gap-1">
										<p class="text-sm text-muted-foreground">Resume</p>
										{#if $form.resume}
											<div class="flex items-center gap-2">
												<FileText class="h-4 w-4" />
												<p class="font-medium">Resume attached</p>
											</div>
										{:else}
											<p class="font-medium text-amber-500">No resume attached</p>
										{/if}
									</div>

									<div class="flex">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											class="gap-1"
											onclick={() => (activeTab = 'details')}
										>
											Edit details
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
											>
										</Button>
									</div>
								</div>
							</div>

							<!-- Questions Review -->
							{#if questions.length > 0}
								<div>
									<h4
										class="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
									>
										Additional Questions
									</h4>
									<div class="rounded-lg border bg-muted/30 p-4">
										<div class="space-y-4">
											{#each questions as question, index}
												{#if index > 0}
													<Separator />
												{/if}
												<div>
													<p class="font-medium">{index + 1}. {question.Content}</p>
													<p class="mt-2">
														{$form.question_response_array[index].response || 'Not answered'}
													</p>
												</div>
											{/each}

											<div class="flex">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													class="gap-1"
													onclick={() => (activeTab = 'questions')}
												>
													Edit answers
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
													>
												</Button>
											</div>
										</div>
									</div>
								</div>
							{/if}

							<!-- Disclaimer and Submit buttons -->
							<div class="mt-6 border-t pt-6">
								<p class="mb-6 text-sm text-muted-foreground">
									By clicking "Submit," you acknowledge that the responsibility for all subsequent
									actions rests solely with the employer. IT Careers nor The University of Belize is
									liable for any issues, disputes, or shortcomings that may arise.
								</p>

								{#if $errors.draft}
									<p class="mb-4 text-sm text-destructive">{$errors.draft}</p>
								{/if}

								<div class="flex flex-wrap gap-3">
									{#if $form.draft}
										<Button
											type="submit"
											id="submit_button"
											formaction="?/createApplication"
											onclick={() => {
												$form.draft = false;
												document.getElementById('submit_button')!.click();
											}}
											class="gap-2"
										>
											<Send size={16} />
											Submit Application
										</Button>

										<Button
											type="submit"
											formaction="?/createApplication"
											onclick={() => ($form.draft = true)}
											variant="outline"
											class="gap-2"
										>
											<Save size={16} />
											Save as Draft
										</Button>
									{:else}
										<Button disabled>
											<CheckCircle2 class="mr-2 h-4 w-4" />
											Application Submitted
										</Button>
									{/if}

									<Button
										variant="ghost"
										type="button"
										onclick={() => history.back()}
										class="gap-2"
									>
										<ArrowLeft size={16} />
										Cancel
									</Button>
								</div>
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Root>
			</form>
		</div>

		<!-- Sidebar - Job details -->
		<div class="space-y-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Job Details</Card.Title>
					<Card.Description>Information about the position</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6">
					<!-- Job quick info -->
					<a
						href="/dashboard/jobs/view/{job.Id}"
						class="block rounded-md border p-4 transition-colors hover:bg-accent/50"
					>
						<h3 class="line-clamp-1 text-lg font-medium">{job.Title}</h3>
						<div class="text-sm text-muted-foreground">
							{@render nameof__job_creator(job_creator as IJobCreator)}
						</div>

						<div class="mt-4 flex flex-col gap-3">
							<div class="flex items-center gap-2">
								<Coins size={16} class="text-muted-foreground" />
								<span>${formatSalary(job.MinRate)} - ${formatSalary(job.MaxRate)}/hr</span>
							</div>

							<div class="flex items-center gap-2">
								<Briefcase size={16} class="text-muted-foreground" />
								<span>{job_type?.Name || 'Not specified'}</span>
							</div>

							<div class="flex items-center gap-2">
								<Clock3 size={16} class="text-muted-foreground" />
								<span>{@render posted_relative_time(job_obj)}</span>
							</div>

							<div class="flex items-center gap-2">
								<MapPin size={16} class="text-muted-foreground" />
								<span>{job_creator?.Location || 'Remote/Not specified'}</span>
							</div>
						</div>

						<div class="mt-4">
							<div class="flex items-center gap-1 text-sm text-primary">
								View full job details
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
								>
							</div>
						</div>
					</a>

					<!-- Company info -->
					<div>
						<h4 class="mb-3 text-sm font-semibold">About the company</h4>
						<div class="flex items-center gap-3">
							<div class="flex-shrink-0">
								{#if job_creator?.ProfilePicture}
									<Avatar.Root class="h-10 w-10">
										<Avatar.Image
											src={job_creator.ProfilePicture}
											alt={job_creator?.FirstName + ' ' + job_creator?.LastName}
										/>
										<Avatar.Fallback
											>{getInitials(job_creator?.FirstName, job_creator?.LastName)}</Avatar.Fallback
										>
									</Avatar.Root>
								{:else}
									<div
										class="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 font-semibold text-primary"
									>
										{getInitials(job_creator?.FirstName, job_creator?.LastName)}
									</div>
								{/if}
							</div>

							<div>
								<div class="font-medium">{job_creator?.FirstName} {job_creator?.LastName}</p>
								<a
									href="/dashboard/organizations/{job_creator?.Id}"
									class="text-sm text-primary hover:underline"
								>
									View profile
								</a>
							</div>
						</div>
					</div>

					<!-- Application status if already applied -->
					{#if application_status && application_form.data.draft !== false}
						<div class="rounded-md border bg-muted/50 p-4">
							<h4 class="mb-2 text-sm font-semibold">Application Status</h4>
							<div
								class={cn(
									'inline-flex w-fit items-center gap-2 rounded-md px-2 py-1 text-sm font-medium',
									statusClass
								)}
							>
								{#if application_status === 'pending' && application_form.data.draft !== true}
									<Loader2 size={14} class="animate-spin" />
								{:else if application_status === 'approved'}
									<CheckCircle2 size={14} />
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
									>
								{/if}
								{statusLabel}
							</div>

							{#if application_status === 'pending' && application_form.data.draft !== true}
								<div class="mt-2 text-sm text-muted-foreground">
									Your application is being reviewed by the employer.
								</div>
							{:else if application_status === 'approved'}
								<div class="mt-2 text-sm text-muted-foreground">
									Congratulations! Your application has been approved.
								</div>
							{:else if application_status === 'rejected'}
								<div class="mt-2 text-sm text-muted-foreground">
									Unfortunately, your application was not selected at this time.
								</div>
							{:else if application_form.data.draft === true}
								<div class="mt-2 text-sm text-muted-foreground">
									Your application is saved as a draft. You can edit and submit it later.
								</div>
							{/if}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Help Card -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Need Help?</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="mb-4 text-sm text-muted-foreground">
						If you have any questions about this application, please contact our support team.
					</div>
					<Button variant="outline" class="w-full gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
						>
						Contact Support
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
