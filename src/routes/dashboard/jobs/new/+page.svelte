<!---- TODO 
- [ ] Add a way to delete questions
- [ ] Add a way to edit questions
- [ ] Add a way to reorder questions
-->
<script lang="ts">
	import { page } from '$app/stores';
	import Select from '$lib/components/compatibility/select.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as RadioGroup from '$lib/components/vendor/ui/radio-group';
	import { Textarea } from '$lib/components/vendor/ui/textarea';

	import { Briefcase, DollarSign } from 'lucide-svelte';
	import { superForm, type FormResult } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';
	let drafting = $state(false);
	const props = $props();
	const page_data: JobsData = {
		...props,
		data: props.data || {}
	};
	type JobsData = PageData & {
		data: Record<string, any>;
	};
	interface IQuestion {
		id: number;
		Content: string;
		Type: boolean;
		Draft: boolean;
		JobsId: string; // UUID
	}
	const { data }: JobsData = page_data;
	let questions: IQuestion[] = $state($page.data.questions);
	let JobTitle: string = $state('Type a title to the left to begin');

	const { form, errors, constraints, enhance } = superForm(
		data.jobForm, //?? data.super_form ?? props.form?.super_form ?? data
		{
			resetForm: false,
			invalidateAll: false
		}
	);
	const {
		form: questionForm,
		errors: questionErrors,
		message: questionMessage,
		constraints: questionConstraints,
		enhance: qEnhance
	} = superForm(
		data.questionForm, //?? data.super_form ?? props.form?.super_form ?? data
		{
			resetForm: true,
			invalidateAll: true,
			onUpdate: ({ form, result }) => {
				const action = result.data as FormResult<ActionData>;
				if (action.questions) questions = action.questions as unknown as IQuestion[];
			}
		}
	);
	// import * as m from '$lib/paraglide/messages.js';
</script>

<!-- <SuperDebug data={$form} /> -->
<!-- svelte-ignore component_name_lowercase -->
<noscript>
	<section class="header text-archivo mx-2 my-8 flex flex-col space-y-1 lg:mx-8">
		<h1 class="text-5xl font-extralight lg:text-6xl">Sorry, This Feature is Disabled</h1>
		<p class="text-lg lg:text-2xl">
			You need JavaScript in order to do this. Enable it and try reloading.
		</p>
	</section>
</noscript>
<!-- svelte-ignore component_name_lowercase -->
<page class="jsonly mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">New Job Listing</h1>
		<p class="text-lg lg:text-2xl">Create a new job that interns can apply to</p>
	</section>
	<div class="text-inter flex flex-wrap items-start gap-8 self-stretch">
		<!-- Left Column -->
		<l-column class="flex w-fit flex-col items-start gap-6">
			<JobCard.Root class="w-[305px] lg:w-[320px]">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title>
						<noscript>
							<p>Type in a title to the left to begin</p>
						</noscript>
						<p class="jsonly">{JobTitle}</p>
						<span class="tracking-wide"
							><Badge
								>{$form.draft === undefined
									? 'Draft (Unsaved)'
									: $form.draft === true
										? 'Draft (Saved)'
										: 'Live'}</Badge
							></span
						>
					</JobCard.Title>
					<card-description class="flex flex-col gap-2">
						<JobCard.Description>HireLATAM</JobCard.Description>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<DollarSign strokeWidth="2" size="16" />
							<p>$24/hr &ndash; $40/hr</p>
						</div>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Briefcase strokeWidth="2" size="16" />
							<p>Belize (In-Person)</p>
						</div>
					</card-description>
				</JobCard.Content>
			</JobCard.Root>
		</l-column>
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<!-- For debug: action="https://formtester.goodbytes.be/post.php" -->
			<!-- <form id="QuestionForm" action="?/createQuestion" method="POST" use:enhance></form> -->

			<div class="w-[305px] lg:w-full">
				<Card.Root class="w-full">
					<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
						<input
							oninput={(e: Event) => {
								if (!e) return;
								const target = e.target as HTMLInputElement;
								const value = target.value;
								if (!value || value.trim() === '') {
									JobTitle = 'Type a title to the left to begin';
									return;
								}
								JobTitle = target.value;
							}}
							type="text"
							form="JobForm"
							name="title"
							class="w-full bg-transparent focus:outline-none"
							{...$constraints.title}
							bind:value={$form.title}
							placeholder="Type in a job title"
						/>
					</Card.Title>
				</Card.Root>
				<p class="text-sm text-red-600">{$errors.title}</p>
			</div>

			<JobCard.Root class="w-full">
				<JobCard.Content class="flex w-[305px] flex-col gap-4 lg:w-[550px]">
					<card-description class="flex flex-col gap-6">
						<article>
							<section class="flex flex-col gap-4 text-black">
								<form
									id="JobForm"
									action="?/createJob"
									method="POST"
									class="flex flex-1 flex-col items-start gap-6"
									use:enhance
								>
									<div>
										<h4 class="text-xl font-semibold leading-7 tracking-tight">Basic Details</h4>
										<p class="text-base font-normal leading-5">
											Basic details such as the hourly rate and type of job
										</p>
									</div>
									<div class="grid w-full max-w-sm items-center gap-1.5">
										<Label for="min-hourly-rate">Minimum hourly rate*</Label>
										<Input
											type="number"
											step="0.25"
											min="0"
											form="JobForm"
											name="min_rate"
											bind:value={$form.min_rate}
											{...$constraints.min_rate}
											id="min-hourly-rate"
											placeholder="Type in a minimum hourly rate"
										/>
									</div>
									<p class="text-sm text-red-600">{$errors.min_rate}</p>

									<div class="grid w-full max-w-sm items-center gap-1.5">
										<Label for="max-hourly-rate">Maximum hourly rate*</Label>
										<Input
											type="number"
											step="0.25"
											min="0"
											form="JobForm"
											bind:value={$form.max_rate}
											{...$constraints.max_rate}
											name="max_rate"
											id="max-hourly-rate"
											placeholder="Type in a maximum hourly rate"
										/>
										<p class="text-sm text-red-600">{$errors.max_rate}</p>
									</div>
									<div class="grid w-full max-w-sm items-center gap-1.5">
										<Label>Type of job*</Label>

										<Select
											{...$constraints.job_type}
											bind:value={$form.job_type}
											name="job_type"
											form="JobForm"
										>
											<option disabled selected hidden>Select an option</option>
											<option selected={$form.job_type === 1} value="1">Hybrid</option>
											<option selected={$form.job_type === 2} value="2">In-person</option>
											<option selected={$form.job_type === 3} value="3">Remote</option>
										</Select>
										<p class="text-sm text-red-600">{$errors.job_type}</p>
									</div>
									<div class="grid w-full max-w-sm items-center gap-1.5">
										<Label>Job description*</Label>
										<RichTextEditor
											bind:value={$form.description}
											form="JobForm"
											name="description"
											{...$constraints.description}
										></RichTextEditor>
										<p class="text-sm text-red-600">{$errors.description}</p>
									</div>
								</form>
								<form id="QuestionForm" action="?/createQuestion" method="POST" use:qEnhance>
									<div class="mb-6 mt-12">
										<h4 class="text-xl font-semibold leading-7 tracking-tight">
											Additional Questions
										</h4>
										<p class="text-base font-normal leading-5">
											Additional questions which you can specify as the employer.
										</p>
									</div>
									<ul class="my-8 flex list-inside list-none flex-col items-start gap-2">
										{#if questions?.length === 0 || questions === undefined}
											<li>
												<p>No questions have been added yet.</p>
												<p class="text-sm font-normal">
													You can add additional questions for the applicants to answer in addition
													to the pre-set questions. These questions can help you gather more
													information about the candidates.
												</p>
											</li>
										{/if}
										{#each questions as question, index}
											<li>
												<div class="gap-0.25 flex flex-col items-start">
													<p class="flex flex-col items-start font-medium italic">
														{index + 1 + '. '}
														{question.Content}
													</p>
													<p class="flex flex-col items-start italic">
														{question.Type === false ? 'Short Answer Question' : 'Yes/No Question'}
													</p>
												</div>
											</li>
										{/each}
									</ul>
									<div
										class="my-4 flex w-full flex-col items-start gap-4 rounded-lg border border-slate-300 p-4"
									>
										<div>
											<p class="text-lg font-semibold">Create a new question (optional)</p>
										</div>
										<Textarea
											form="QuestionForm"
											name="question_content"
											bind:value={$questionForm.question_content}
											{...$questionConstraints.question_content}
											placeholder="Type the question content here."
										/>
										<p class="text-sm text-red-600">{$questionErrors.question_content}</p>
										<p class="text-lg font-semibold">Question Type</p>
										<RadioGroup.Root name="question_type" bind:value={$questionForm.question_type}>
											<div class="flex items-center space-x-2">
												<RadioGroup.Item value="true-false" form="QuestionForm" id="r2" />
												<Label for="r1">Yes/No</Label>
											</div>
											<div class="flex items-center space-x-2">
												<RadioGroup.Item value="short-answer" form="QuestionForm" id="r2" />
												<Label for="r2">Short answer</Label>
											</div>
										</RadioGroup.Root>
										<p class="text-sm text-red-600">
											{$questionErrors.question_type}
										</p>
										<p class="text-sm text-green-600">
											{$questionMessage}
										</p>
										<Button type="submit">Save</Button>
									</div>
									<Button class="w-fit">New Question</Button>
								</form>
							</section>
						</article>
					</card-description>
					<div class="flex items-start gap-4">
						<input type="hidden" name="draft" value={drafting} form="JobForm" />
						<Button class="w-fit" type="submit" onclick={() => (drafting = false)} form="JobForm"
							>Publish</Button
						>
						<Button class="w-fit" type="submit" onclick={() => (drafting = true)} form="JobForm"
							>Save Draft</Button
						>
					</div>
					<p class="text-sm text-red-600">{$errors.title}</p>
				</JobCard.Content>
			</JobCard.Root>
		</r-column>
	</div>
</page>
