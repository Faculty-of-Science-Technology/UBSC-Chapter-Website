<!---- TODO 
- [ ] Add a way to delete questions
- [ ] Add a way to edit questions
- [ ] Add a way to reorder questions
-->
<!-- Overhauled Job Creation Page -->
<script lang="ts">
	import { page } from '$app/state';
	import Select from '$lib/components/compatibility/select.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import * as Accordion from '$lib/components/vendor/ui/accordion';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as RadioGroup from '$lib/components/vendor/ui/radio-group';
	import { Separator } from '$lib/components/vendor/ui/separator';
	import { Switch } from '$lib/components/vendor/ui/switch';
	import * as Tabs from '$lib/components/vendor/ui/tabs';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import {
		Briefcase,
		Building,
		Calendar,
		CheckCircle2,
		DollarSign,
		FileCheck,
		FileQuestion,
		Globe,
		Info,
		MapPin,
		Plus,
		Save,
		Tag,
		Trash2
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms/client';
	import type { ActionData, PageProps } from './$types';

	// State variables
	let drafting = $state(false);
	let removalQuestionID: HTMLInputElement | undefined = $state();
	let activeTab = $state('details');
	let showPreview = $state(false);

	const { data }: PageProps = $props();
	const user = data.user;

	interface IQuestion {
		Id: number;
		Content: string;
		Type: boolean;
		Draft: boolean;
		JobsId: string; // UUID
	}

	// Job preview variables
	let JobTitle: string = $state('Type a title to begin');
	let questions: IQuestion[] = $state(page.data.questions || []);

	// Get forms
	const form_obj = superForm(data.jobForm, {
		resetForm: false,
		invalidateAll: false,
		taintedMessage: null
	});
	const { form, errors, constraints, enhance } = form_obj;

	const {
		form: questionForm,
		errors: questionErrors,
		message: questionMessage,
		constraints: questionConstraints,
		enhance: qEnhance
	} = superForm(data.questionForm, {
		resetForm: true,
		invalidateAll: true,
		onUpdate: ({ form, result }) => {
			const action = result.data as FormResult<ActionData>;
			if (action.questions) questions = action.questions as unknown as IQuestion[];
		}
	});

	// Format salary with commas
	function formatSalary(amount: number): string {
		return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	// Helper function to get job type label
	function getJobTypeLabel(jobType: number | undefined): string {
		switch (jobType) {
			case 1:
				return 'Hybrid';
			case 2:
				return 'In-person';
			case 3:
				return 'Remote';
			default:
				return 'Type not selected';
		}
	}

	// Helper function to get job type icon
	function getJobTypeIcon(jobType: number | undefined): typeof Globe {
		switch (jobType) {
			case 1:
				return Building;
			case 2:
				return MapPin;
			case 3:
				return Globe;
			default:
				return Globe;
		}
	}

	onMount(() => {
		if ($form.description.trim() === '') {
			$form.description = `<p>Tips: Provide a summary of the role, what success in the position looks like, and how this role fits into the organization overall.</p><p>&nbsp;</p><strong>Responsibilities</strong><p>[Be specific when describing each of the responsibilities. Use gender-neutral, inclusive language.]</p><p>Example: Determine and develop user requirements for systems in production, to ensure maximum usability</p><p>&nbsp;</p><strong>Qualifications</strong><p>[Some qualifications you may want to include are Skills, Education, Experience, or Certifications.]</p><p>Example: Excellent verbal and written communication skills</p>`;
		}
	});

	// Check if form is valid for preview
	let hasBasicDetails = $derived(
		$form.title && $form.min_rate && $form.max_rate && $form.job_type && $form.description
	);
</script>

<!-- No JavaScript fallback -->
<noscript>
	<section class="header mx-2 my-8 flex flex-col space-y-1 lg:mx-8">
		<h1 class="text-5xl font-extralight">Sorry, This Feature is Disabled</h1>
		<p class="text-xl">
			You need JavaScript in order to create a job listing. Please enable it and try reloading.
		</p>
	</section>
</noscript>

<!-- Main page content -->
<div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header section with breadcrumbs -->
	<div class="mb-8 flex flex-col gap-2">
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<a href="/dashboard" class="hover:underline">Dashboard</a>
			<span>/</span>
			<a href="/dashboard/jobs" class="hover:underline">Jobs</a>
			<span>/</span>
			<span class="font-medium text-foreground">New Job Listing</span>
		</div>

		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight">Create New Job Listing</h1>
				<p class="text-muted-foreground">
					Create a detailed job listing to attract qualified interns
				</p>
			</div>

			<div class="flex gap-2">
				<Button variant="outline" class="gap-2" onclick={() => (showPreview = !showPreview)}>
					{#if showPreview}
						<Info size="18" />
						<span>Edit Details</span>
					{:else}
						<FileCheck size="18" />
						<span>Preview</span>
					{/if}
				</Button>
			</div>
		</div>
	</div>

	{#if !showPreview}
		<!-- Job Creation Form -->
		<div class="grid gap-8 lg:grid-cols-3">
			<div class="lg:col-span-2">
				<Tabs.Root value={activeTab} class="w-full" onValueChange={(value) => (activeTab = value)}>
					<Tabs.List class="mb-4 w-full">
						<Tabs.Trigger value="details" class="flex-1">Basic Details</Tabs.Trigger>
						<Tabs.Trigger value="description" class="flex-1">Job Description</Tabs.Trigger>
						<Tabs.Trigger value="questions" class="flex-1">Application Questions</Tabs.Trigger>
					</Tabs.List>

					<!-- Main Form -->
					<form
						id="JobForm"
						action="?/createJob"
						method="POST"
						class="flex flex-1 flex-col items-start gap-6"
						use:enhance
					>
						<input type="hidden" name="draft" value={drafting} form="JobForm" />

						<Tabs.Content value="details" class="w-full">
							<Card.Root class="mb-6">
								<Card.Header>
									<Card.Title>Job Information</Card.Title>
									<Card.Description>Basic details about the position</Card.Description>
								</Card.Header>
								<Card.Content class="space-y-6">
									<div class="space-y-2">
										<Label for="job-title" class="text-base font-medium">Job Title *</Label>
										<Input
											id="job-title"
											type="text"
											form="JobForm"
											name="title"
											class="w-full"
											{...$constraints.title}
											bind:value={$form.title}
											oninput={(e) => (JobTitle = e.currentTarget.value || 'Type a title to begin')}
											placeholder="E.g., Frontend Developer, Marketing Intern, Project Coordinator"
										/>
										{#if $errors.title}
											<div class="text-sm text-destructive">{$errors.title}</div>
										{/if}
									</div>

									<div class="grid gap-6 sm:grid-cols-2">
										<div class="space-y-2">
											<Label for="min-rate" class="text-base font-medium"
												>Minimum Hourly Rate (USD) *</Label
											>
											<div class="relative">
												<DollarSign class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
												<Input
													id="min-rate"
													type="number"
													step="0.25"
													min="0"
													form="JobForm"
													name="min_rate"
													class="pl-10"
													bind:value={$form.min_rate}
													{...$constraints.min_rate}
													placeholder="15.00"
												/>
											</div>
											{#if $errors.min_rate}
												<div class="text-sm text-destructive">{$errors.min_rate}</div>
											{/if}
										</div>

										<div class="space-y-2">
											<Label for="max-rate" class="text-base font-medium"
												>Maximum Hourly Rate (USD) *</Label
											>
											<div class="relative">
												<DollarSign class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
												<Input
													id="max-rate"
													type="number"
													step="0.25"
													min="0"
													form="JobForm"
													name="max_rate"
													class="pl-10"
													bind:value={$form.max_rate}
													{...$constraints.max_rate}
													placeholder="25.00"
												/>
											</div>
											{#if $errors.max_rate}
												<div class="text-sm text-destructive">{$errors.max_rate}</div>
											{/if}
										</div>
									</div>

									<div class="space-y-2">
										<Label for="job-type" class="text-base font-medium">Job Type *</Label>
										<Select
											id="job-type"
											{...$constraints.job_type}
											bind:value={$form.job_type}
											name="job_type"
											form="JobForm"
											class="w-full"
										>
											<option disabled selected hidden>Select an option</option>
											<option selected={$form.job_type === 1} value="1">Hybrid</option>
											<option selected={$form.job_type === 2} value="2">In-person</option>
											<option selected={$form.job_type === 3} value="3">Remote</option>
										</Select>
										{#if $errors.job_type}
											<div class="text-sm text-destructive">{$errors.job_type}</div>
										{/if}
									</div>

									<div class="flex items-center gap-3 pt-2">
										<Switch
											name="broadcast_job"
											bind:checked={$form.broadcast_job}
											id="broadcast_job"
											form="JobForm"
										/>
										<div>
											<Label for="broadcast_job" class="text-base font-medium">Notify users</Label>
											<div class="text-sm text-muted-foreground">
												Send an email to all users when this job is published
											</div>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</Tabs.Content>

						<Tabs.Content value="description" class="w-full">
							<Card.Root class="mb-6">
								<Card.Header>
									<Card.Title>Job Description</Card.Title>
									<Card.Description
										>Provide detailed information about the position</Card.Description
									>
								</Card.Header>
								<Card.Content>
									<div class="space-y-3">
										<Label class="text-base font-medium">Job Description *</Label>
										<RichTextEditor
											bind:value={$form.description}
											form="JobForm"
											name="description"
											{...$constraints.description}
										/>
										{#if $errors.description}
											<div class="text-sm text-destructive">{$errors.description}</div>
										{/if}
										<div class="text-sm text-muted-foreground">
											Include details on responsibilities, requirements, benefits, and company
											culture
										</div>
										<div class="flex items-center space-x-2 text-sm text-muted-foreground">
											<!-- @todo Make this a reality one day -->
											<!-- <Fa icon={faMarkdown} /> <span>MarkDown supported</span> -->
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</Tabs.Content>
					</form>

					<Tabs.Content value="questions" class="w-full">
						<Card.Root class="mb-6">
							<Card.Header>
								<Card.Title>Application Questions</Card.Title>
								<Card.Description>
									Create custom questions for candidates to answer when applying
								</Card.Description>
							</Card.Header>
							<Card.Content>
								<form
									id="QuestionForm"
									action="?/createQuestion"
									method="POST"
									use:qEnhance
									class="space-y-6"
								>
									<input
										type="hidden"
										name="question_id"
										bind:this={removalQuestionID}
										form="QuestionForm"
									/>

									<!-- Current Questions List -->
									{#if questions?.length > 0}
										<Accordion.Root type="single" class="w-full">
											{#each questions as question, index}
												<Accordion.Item value={`question-${index}`} class="border-b">
													<Accordion.Trigger
														class="flex w-full items-center justify-between py-4 text-left font-medium"
													>
														<div class="flex flex-1 items-center gap-2">
															<span
																class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
															>
																{index + 1}
															</span>
															<span class="flex-1 truncate">{question.Content}</span>
														</div>
													</Accordion.Trigger>
													<Accordion.Content class="pb-4 pt-1">
														<div class="flex flex-col gap-3">
															<div class="flex items-center gap-2 text-sm">
																<Tag size={16} />
																<span>
																	{question.Type === false
																		? 'Short Answer Question'
																		: 'Yes/No Question'}
																</span>
															</div>
															<Button
																type="submit"
																size="sm"
																variant="destructive"
																onclick={() => (removalQuestionID.value = question.Id.toString())}
																formaction="?/removeQuestion"
																class="mt-2 w-fit gap-1"
															>
																<Trash2 size={16} />
																<span>Remove Question</span>
															</Button>
														</div>
													</Accordion.Content>
												</Accordion.Item>
											{/each}
										</Accordion.Root>
									{:else}
										<div
											class="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center"
										>
											<div class="mb-3 rounded-full bg-primary/10 p-3">
												<FileQuestion size={24} class="text-primary" />
											</div>
											<h3 class="text-lg font-medium">No questions added yet</h3>
											<div class="mt-1 max-w-sm text-sm text-muted-foreground">
												Custom questions help you gather specific information from applicants beyond
												the standard application form.
											</div>
										</div>
									{/if}

									<!-- Add New Question -->
									<Separator />

									<div class="space-y-4">
										<h3 class="text-lg font-medium">Add New Question</h3>

										<div class="space-y-2">
											<Label for="question-content">Question Content</Label>
											<Textarea
												id="question-content"
												form="QuestionForm"
												name="question_content"
												bind:value={$questionForm.question_content}
												placeholder="Type your question here (e.g., 'Describe your experience with React')"
												rows={3}
											/>
											{#if $questionErrors.question_content}
												<div class="text-sm text-destructive">
													{$questionErrors.question_content}
												</div>
											{/if}
										</div>

										<div class="space-y-2">
											<Label>Question Type</Label>
											<RadioGroup.Root
												name="question_type"
												bind:value={$questionForm.question_type}
												class="flex flex-col gap-3 pt-1"
											>
												<div class="flex items-center space-x-2">
													<RadioGroup.Item value="true-false" form="QuestionForm" id="yes-no" />
													<Label for="yes-no" class="cursor-pointer">Yes/No Question</Label>
												</div>
												<div class="flex items-center space-x-2">
													<RadioGroup.Item
														value="short-answer"
														form="QuestionForm"
														id="short-answer"
													/>
													<Label for="short-answer" class="cursor-pointer"
														>Short Answer Question</Label
													>
												</div>
											</RadioGroup.Root>
											{#if $questionErrors.question_type}
												<div class="text-sm text-destructive">{$questionErrors.question_type}</div>
											{/if}
										</div>

										{#if $questionMessage}
											<div class="text-sm text-green-600">{$questionMessage}</div>
										{/if}

										<Button type="submit" class="gap-1">
											<Plus size={16} />
											<span>Add Question</span>
										</Button>
									</div>
								</form>
							</Card.Content>
						</Card.Root>
					</Tabs.Content>
				</Tabs.Root>

				<div class="mt-6 flex items-center justify-between gap-4">
					<div>
						{#if data.jobForm.id}
							<p class="text-sm text-muted-foreground">
								Last saved: {new Date().toLocaleString()}
							</p>
						{/if}
					</div>
					<div class="flex gap-3">
						<Button
							variant="outline"
							type="submit"
							onclick={() => (drafting = true)}
							form="JobForm"
							class="gap-1"
						>
							<Save size={16} />
							<span>Save Draft</span>
						</Button>
						<Button type="submit" onclick={() => (drafting = false)} form="JobForm" class="gap-1">
							<FileCheck size={16} />
							<span>Publish Job</span>
						</Button>
					</div>
				</div>
			</div>

			<!-- Preview Card (right column) -->
			<div class="lg:col-span-1">
				<div class="sticky top-6 space-y-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Job Preview</Card.Title>
							<Card.Description>How your job will appear to applicants</Card.Description>
						</Card.Header>
						<Card.Content>
							<JobCard.Root class="border-0 p-0 shadow-none">
								<JobCard.Header>
									<div>
										<Badge variant={drafting ? 'outline' : 'default'} class="mb-2">
											{$form.draft === undefined
												? 'Draft (Unsaved)'
												: $form.draft === true
													? 'Draft (Saved)'
													: 'Live'}
										</Badge>
										<JobCard.Title class="line-clamp-2 text-xl font-semibold">
											{JobTitle || 'Type a title to begin'}
										</JobCard.Title>
										<JobCard.Description>HireLATAM</JobCard.Description>
									</div>
								</JobCard.Header>
								<JobCard.Content class="flex flex-col gap-4 pt-4">
									<div class="flex flex-col gap-3">
										<div class="flex items-center gap-2 text-sm">
											<DollarSign size={16} class="text-muted-foreground" />
											<span>
												{$form.min_rate ? `$${formatSalary($form.min_rate)}/hr` : '$0/hr'}
												{$form.max_rate ? ` – $${formatSalary($form.max_rate)}/hr` : ''}
											</span>
										</div>
										<div class="flex items-center gap-2 text-sm">
											{#if $form.job_type}
												{@const Icon = getJobTypeIcon($form.job_type)}
												<Icon size={16} class="text-muted-foreground" />
												<span>{getJobTypeLabel($form.job_type)}</span>
											{:else}
												<Briefcase size={16} class="text-muted-foreground" />
												<span>Job type not specified</span>
											{/if}
										</div>
										<div class="flex items-center gap-2 text-sm">
											<Calendar size={16} class="text-muted-foreground" />
											<span>Posted {new Date().toLocaleDateString()}</span>
										</div>
									</div>

									{#if questions?.length > 0}
										<div class="flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-sm">
											<Info size={16} class="text-primary" />
											<span
												>{questions.length} custom question{questions.length > 1 ? 's' : ''} for applicants</span
											>
										</div>
									{/if}

									<Button variant="outline" class="w-full" disabled={!hasBasicDetails}>
										View Details
									</Button>
								</JobCard.Content>
							</JobCard.Root>
						</Card.Content>
					</Card.Root>

					<Card.Root>
						<Card.Header>
							<Card.Title>Tips</Card.Title>
						</Card.Header>
						<Card.Content>
							<ul class="space-y-3 text-sm text-muted-foreground">
								<li class="flex gap-2">
									<CheckCircle2 size={16} class="mt-0.5 shrink-0 text-green-500" />
									<span>Include specific skills and qualifications</span>
								</li>
								<li class="flex gap-2">
									<CheckCircle2 size={16} class="mt-0.5 shrink-0 text-green-500" />
									<span>Specify education requirements and experience level</span>
								</li>
								<li class="flex gap-2">
									<CheckCircle2 size={16} class="mt-0.5 shrink-0 text-green-500" />
									<span>Mention work hours and schedule flexibility</span>
								</li>
								<li class="flex gap-2">
									<CheckCircle2 size={16} class="mt-0.5 shrink-0 text-green-500" />
									<span>Highlight growth opportunities and mentorship</span>
								</li>
							</ul>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	{:else}
		<!-- Full Preview Mode -->
		<div class="grid gap-8">
			<Card.Root>
				<Card.Content class="p-6">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<Badge variant="outline" class="mb-2">
								{$form.draft === undefined
									? 'Draft (Unsaved)'
									: $form.draft === true
										? 'Draft'
										: 'Ready to Publish'}
							</Badge>
							<h2 class="text-2xl font-bold">{JobTitle || 'Untitled Position'}</h2>
							<div class="text-muted-foreground">{user!.FirstName + ' ' + user!.LastName}</div>
						</div>
						<div>
							<Button variant="outline" class="gap-1" onclick={() => (showPreview = false)}>
								<Info size={18} />
								<span>Edit Details</span>
							</Button>
						</div>
					</div>

					<div class="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<DollarSign size={20} class="text-primary" />
							</div>
							<div>
								<div class="text-sm font-medium text-muted-foreground">Salary Range</div>
								<div class="font-medium">
									{$form.min_rate ? `$${formatSalary($form.min_rate)}/hr` : 'Not specified'}
									{$form.max_rate ? ` – $${formatSalary($form.max_rate)}/hr` : ''}
								</div>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								{#if $form.job_type}
									{@const Icon = getJobTypeIcon($form.job_type)}
									<Icon size={20} class="text-primary" />
								{/if}
							</div>
							<div>
								<div class="text-sm font-medium text-muted-foreground">Job Type</div>
								<div class="font-medium">{getJobTypeLabel($form.job_type) || 'Not specified'}</div>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
								<Calendar size={20} class="text-primary" />
							</div>
							<div>
								<div class="text-sm font-medium text-muted-foreground">Posting Date</div>
								<div class="font-medium">{new Date().toLocaleDateString()}</div>
							</div>
						</div>
					</div>

					<Separator class="my-6" />

					<div class="prose max-w-none">
						<h3 class="mb-4 text-xl font-semibold">Job Description</h3>
						{#if $form.description}
							<div class="prose max-w-none">
								{@html $form.description}
							</div>
						{:else}
							<div class="text-muted-foreground">No job description provided yet.</div>
						{/if}
					</div>

					{#if questions?.length > 0}
						<div class="mt-8">
							<h3 class="mb-4 text-xl font-semibold">Application Questions</h3>
							<div class="space-y-4">
								{#each questions as question, index}
									<div class="rounded-lg border p-4">
										<h4 class="mb-1 font-medium">Question {index + 1}</h4>
										<div>{question.Content}</div>
										<div class="mt-2 text-sm text-muted-foreground">
											{question.Type === false ? 'Short Answer Question' : 'Yes/No Question'}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<Separator class="my-6" />

					<div class="mt-8 flex items-center justify-end gap-4">
						<Button
							variant="outline"
							type="submit"
							onclick={() => {
								drafting = true;
								showPreview = false;
							}}
							form="JobForm"
							class="gap-1"
						>
							<Save size={16} />
							<span>Save Draft</span>
						</Button>
						<Button
							type="submit"
							onclick={() => {
								drafting = false;
								showPreview = false;
							}}
							form="JobForm"
							class="gap-1"
						>
							<FileCheck size={16} />
							<span>Publish Job</span>
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}
</div>
