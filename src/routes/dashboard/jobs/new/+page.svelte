<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as RadioGroup from '$lib/components/vendor/ui/radio-group';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Textarea } from '$lib/components/vendor/ui/textarea';

	import { Briefcase, DollarSign } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const job_id = $page.params.job_id;
	onMount(() => {
		console.log(job_id);
	});

	// import * as m from '$lib/paraglide/messages.js';
</script>

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
	<form class="text-inter flex flex-wrap items-start gap-8 self-stretch" method="POST" use:enhance>
		<!-- Left Column -->
		<l-column class="flex w-fit flex-col items-start gap-6">
			<JobCard.Root class="w-[305px] lg:w-[320px]">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title>
						<p>Remote Senior Backend Software Engineer</p>
						<span class="tracking-wide"><Badge>Draft</Badge></span>
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
			<Card.Root class="w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<input
						type="text"
						class="w-full bg-transparent focus:outline-none"
						placeholder="Type in a job title"
					/>
				</Card.Title>
			</Card.Root>

			<JobCard.Root class="w-full">
				<JobCard.Content class="flex w-[305px] flex-col gap-4 lg:w-[550px]">
					<card-description class="flex flex-col gap-6">
						<article>
							<section class="flex flex-col gap-4 text-black">
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
										id="min-hourly-rate"
										placeholder="Type in a minimum hourly rate"
									/>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label for="max-hourly-rate">Maximum hourly rate*</Label>
									<Input
										type="number"
										step="0.25"
										min="0"
										id="max-hourly-rate"
										placeholder="Type in a maximum hourly rate"
									/>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label>Type of job*</Label>

									<Select.Root type="single">
										<Select.Trigger class="w-full">Select an option</Select.Trigger>
										<Select.Content>
											<Select.Item value="in-person">Hybrid</Select.Item>
											<Select.Item value="hybrid">In-person</Select.Item>
											<Select.Item value="remote">Remote</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label>Job description*</Label>
									<RichTextEditor
										oninput={(e) => {
											console.log(e);
										}}
									></RichTextEditor>
								</div>
								<div class="mb-6 mt-12">
									<h4 class="text-xl font-semibold leading-7 tracking-tight">
										Additional Questions
									</h4>
									<p class="text-base font-normal leading-5">
										Additional questions which you can specify as the employer.
									</p>
								</div>
								<div class="gap-0.25 flex flex-col items-start">
									<p class="flex flex-col items-start font-medium italic">
										1. How many years of experience do you have in Go/Golang Development?
									</p>
									<p class="flex flex-col items-start italic">Short Answer Question</p>
								</div>
								<div
									class="flex w-full flex-col items-start gap-4 rounded-lg border border-slate-300 p-4"
								>
									<p class="text-lg font-semibold">Currently editing #4</p>
									<Textarea placeholder="Type the question content here." />
									<p class="text-lg font-semibold">Question Type</p>
									<RadioGroup.Root value="yes-no" name="questionType">
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="yes-no" id="r1" />
											<Label for="r1">Yes/No</Label>
										</div>
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="short-answer" id="r2" />
											<Label for="r2">Short answer</Label>
										</div>
									</RadioGroup.Root>
									<Button>Save</Button>
								</div>
								<Button class="w-fit">New Question</Button>
							</section>
						</article>
					</card-description>
					<div class="flex items-start gap-4">
						<Button class="w-fit">Publish</Button>
						<Button class="w-fit">Save Draft</Button>
					</div>
				</JobCard.Content>
			</JobCard.Root>
		</r-column>
	</form>
</page>
