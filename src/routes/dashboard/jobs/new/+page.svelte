<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import { Briefcase, Clock3, DollarSign } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const job_id = $page.params.job_id;
	onMount(() => {
		console.log(job_id);
	});

	// import * as m from '$lib/paraglide/messages.js';
</script>

<!-- svelte-ignore component_name_lowercase -->
<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">New Job Listing</h1>
		<p class="text-lg lg:text-2xl">Create a new job that interns can apply to</p>
	</section>
	<form class="text-inter flex flex-wrap items-start gap-8 self-stretch" method="POST" use:enhance>
		<!-- Left Column -->
		<l-column class="flex w-fit flex-col items-start gap-6">
			<Card.Root class="w-full">
				<Card.Title class="items-center justify-center py-2 text-center text-2xl">
					<p>Explore Available Jobs</p>
				</Card.Title>
			</Card.Root>
			<JobCard.Root class="w-[305px] lg:w-[320px]">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title>
						<p>Remote Senior Backend Software Engineer</p>
						<span class="tracking-wide"><Badge>Draft</Badge></span>
					</JobCard.Title>
					<card-description class="flex flex-col gap-2">
						<JobCard.Description>HireLATAM</JobCard.Description>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Briefcase strokeWidth="2" size="16" />
							<p>Belize (In-Person)</p>
						</div>
						<div class="flex flex-row items-center gap-2 text-xs text-slate-400">
							<Clock3 strokeWidth="2" size="16" />
							<p>5m ago</p>
						</div>
						<Button>Continue application</Button>
					</card-description>
				</JobCard.Content>
			</JobCard.Root>
		</l-column>
		<!-- Right Column -->
		<r-column class="flex flex-1 flex-col items-start gap-6">
			<RichTextEditor
				oninput={(e) => {
					console.log(e);
				}}
			></RichTextEditor>
			<Card.Root class="w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<p>Post by HireLATAM</p>
				</Card.Title>
			</Card.Root>

			<JobCard.Root class="w-full">
				<JobCard.Content class="flex flex-col gap-4">
					<JobCard.Title class="flex flex-col gap-2">
						<p>Remote Senior Backend Software Engineer</p>
					</JobCard.Title>
					<card-description class="flex flex-col gap-6">
						<div class="flex flex-col gap-2">
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
						</div>
						<Button class="w-fit">Apply for this job</Button>
						<article>
							<section class="flex flex-col gap-4 text-black">
								<div>
									<h4 class="text-xl font-semibold leading-7 tracking-tight">About the job</h4>
									<p class="text-base font-normal leading-5">LLM Go Developer</p>
								</div>
								<p class="text-base font-bold leading-5">Experience</p>
								<ul class="list-inside list-disc">
									<li>6 - 20 Years</li>
									<li>Location: Permanent Remote Anywhere in the world</li>
									<li>Contract Duration: 6 - 12 Months</li>
									<li>Opportunity: Full Time, 8 hours, 4 hours Mandatory overlap with PST</li>
									<li>Total Years Of Experience: Min 6+ years Mandatory software engineer exp.</li>
									<li>Mandatory Skills: Go (min 5 yrs)</li>
								</ul>
								<p class="text-base font-bold leading-5">Job Requirements</p>
								<ul class="list-inside list-disc">
									<li>
										Bachelor's/Master's degree in Engineering, Computer Science, or equivalent
										experience.
									</li>
									<li>
										At least 6+ years of relevant experience as a software engineer, with a focus on
										backend development.
									</li>
									<li>
										Demonstrated leadership ability, preferably with experience overseeing a team of
										software engineers.
									</li>
									<li>
										In-depth knowledge of the Go programming language and best practices in software
										development.
									</li>
									<li>
										Some experience with AI systems and code-creation technologies is desirable.
									</li>
									<li>
										Strong problem-solving abilities and the capacity for critical and strategic
										thinking.
									</li>
									<li>
										Exceptional communication skills, with proficiency in English, both written and
										verbal.
									</li>
								</ul>

								<p class="text-base font-bold leading-5">About The Role</p>
								<p class="text-base font-normal leading-5">
									A well-established company that is leveraging advanced technology to bring the
									science-fiction fantasy of collaborative and open-ended computer dialogues to life
									is seeking experienced Go Developers. The ideal candidate will work closely with
									cross-functional teams to define, design, and deliver new features for the next
									generation of dialog agents. These agents will have diverse applications in
									education, entertainment, and general question-answering. This is an exciting
									opportunity for engineers eager to work in a fast-paced environment and contribute
									to innovative projects.
								</p>

								<p class="text-base font-bold leading-5">Job Responsibilities</p>
								<ul class="list-inside list-disc">
									<li>
										Review code and solutions generated by AI systems, ensuring adherence to quality
										standards and best practices.
									</li>
									<li>
										Organize the development cycle, manage project priorities, and set goals and
										deadlines.
									</li>
									<li>
										Utilize expertise in Go programming to resolve complex coding issues that arise
										during AI validation.
									</li>
									<li>
										Foster a collaborative team environment that encourages innovation,
										communication, and continuous improvement.
									</li>
									<li>
										Verify the accuracy, efficiency, and reliability of AI-generated code by
										conducting validation checks.
									</li>
									<li>
										Work with cross-functional teams to enhance the AI system's capabilities and
										integrate it with other components.
									</li>
									<li>
										Analyze team members' code and provide constructive feedback to ensure
										high-quality software development.
									</li>
								</ul>

								<p class="text-base font-bold leading-5">Skills:</p>
								<p class="text-base font-normal leading-5">
									code creation technologies, code-review, project management, strategic thinking,
									code analysis, software engineering, code-creation technologies, go programming,
									leadership ability, backend development, communication, collaboration, go, problem
									solving, communication skills, software, software development, go (golang), code
									validation, ai systems, code review, critical thinking, quality assurance, code
									reviews, problem-solving, software development best practices, team leadership,
									software engineer, leadership, coding standards
								</p>
							</section>
						</article>
					</card-description>
				</JobCard.Content>
			</JobCard.Root>
		</r-column>
	</form>
</page>
