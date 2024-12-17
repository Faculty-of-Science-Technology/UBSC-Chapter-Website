<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as RadioGroup from '$lib/components/vendor/ui/radio-group';
	import { Switch } from '$lib/components/vendor/ui/switch';

	import { Briefcase, Clock3, DollarSign } from 'lucide-svelte';
	import { onMount } from 'svelte';
	let isDragOver = false;
	const job_id = $page.params.job_id;
	onMount(() => {
		console.log(job_id);
	});

	// import * as m from '$lib/paraglide/messages.js';
</script>

<!-- svelte-ignore component_name_lowercase -->
<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">Start Application</h1>
		<p class="text-lg lg:text-2xl">Start your application to apply for this job</p>
	</section>
	<form class="text-inter flex flex-wrap items-start gap-8 self-stretch" method="POST" use:enhance>
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<Card.Root class="w-[305px] pb-2 lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					Remote Senior Backend Software Engineer &mdash; HireLATAM
				</Card.Title>
				<card-description class="flex flex-col gap-2 px-6">
					<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
						<DollarSign strokeWidth="2" size="16" />
						<p>$24/hr &ndash; $40/hr</p>
					</div>
					<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
						<Briefcase strokeWidth="2" size="16" />
						<p>Belize (In-Person)</p>
					</div>
					<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
						<Clock3 strokeWidth="2" size="16" />
						<p>5m ago</p>
					</div>
				</card-description>
			</Card.Root>

			<JobCard.Root class="w-full">
				<JobCard.Content class="flex w-[305px] flex-col gap-4 lg:w-[550px]">
					<card-description class="mb-2 flex flex-col gap-6">
						<article>
							<section class="flex flex-col gap-4 text-black">
								<div class="flex flex-col gap-4">
									<div>
										<h4 class="text-xl font-semibold leading-7 tracking-tight">Personal Details</h4>
										<p class="text-base font-normal leading-5">Taken from your profile.</p>
										<ul class="list-inside list-disc">
											<li>First Name: <b>John</b></li>
											<li>Last Name: <b>Doe</b></li>
										</ul>
									</div>
									<p>
										Change this in <a href="/dashboard/settings" class="underline">settings</a>.
									</p>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label for="mphone-number">Mobile phone number*</Label>
									<Input
										type="tel"
										id="mphone-number"
										placeholder="Type in your mobile phone number"
									/>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label for="email">Email address*</Label>
									<Input type="email" id="email" placeholder="Type in your email address" />
								</div>
								<div class="flex items-center space-x-2">
									<Switch id="email-alt" />
									<Label for="email-alt">Use the one from my profile</Label>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label for="resume">Attach your resume*</Label>
									<Input
										id="resume"
										type="file"
										class={isDragOver ? 'bg-black' : ''}
										ondragenter={() => (isDragOver = true)}
										ondragleave={() => (isDragOver = false)}
										ondrop={() => (isDragOver = false)}
									/>
									<p class="text-sm text-muted-foreground">
										Click to select a file or drop on top of the above button
									</p>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label>Please enter notice period in days. Example: 45*</Label>
									<Input
										type="number"
										id="notice-period"
										placeholder="Enter you notice period in days"
									/>
								</div>
								<div class="mb-6 mt-12">
									<h4 class="text-xl font-semibold leading-7 tracking-tight">
										Additional Questions
									</h4>
									<p class="text-base font-normal leading-5">
										Additional questions specified by the employer.
									</p>
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label>How many years of experience do you have in Go/Golang Development?*</Label>
									<Input type="number" id="notice-period" placeholder="Enter a valid answer" />
								</div>
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label>Are you ok with a Contract Role? Contract Duration 6 - 12 Months.*</Label>
									<RadioGroup.Root value="yes-no" name="questionType">
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="yes-no" id="yes" />
											<Label for="yes">Yes</Label>
										</div>
										<div class="flex items-center space-x-2">
											<RadioGroup.Item value="short-answer" id="no" />
											<Label for="no">No</Label>
										</div>
									</RadioGroup.Root>
								</div>
							</section>
						</article>
					</card-description>
					<p class="mb-3 text-sm">
						By clicking "Submit," you acknowledge that the responsibility for all subsequent actions
						rests solely with the employer. TalentPool nor The University of Belize is liable for
						any issues, disputes, or shortcomings that may arise.
					</p>
					<div class="flex items-start gap-4">
						<Button class="w-fit">Submit for review</Button>
						<Button class="w-fit">Save Draft</Button>
					</div>
				</JobCard.Content>
			</JobCard.Root>
		</r-column>
	</form>
</page>
