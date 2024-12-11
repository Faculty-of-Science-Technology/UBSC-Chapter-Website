<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as JobCard from '$lib/components/vendor/ui/job-card';
	import * as ToggleGroup from '$lib/components/vendor/ui/toggle-group';
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		Briefcase,
		Clock3,
		DollarSign,
		Heading,
		List,
		ListOrdered,
		Redo,
		Strikethrough,
		Undo
	} from 'lucide-svelte';
	import Bold from 'lucide-svelte/icons/bold';
	import Italic from 'lucide-svelte/icons/italic';
	import Underline from 'lucide-svelte/icons/underline';
	import { onMount } from 'svelte';
	const job_id = $page.params.job_id;
	onMount(() => {
		console.log(job_id);
	});

	let markdownBuffer = '';

	function handleKeydown(event: KeyboardEvent) {
		const selection = window.getSelection();
		if (!selection) return;

		if (event.key === 'Tab') {
			event.preventDefault();
			const range = selection.getRangeAt(0);
			const tabNode = document.createTextNode('\t');
			range.insertNode(tabNode);
			range.setStartAfter(tabNode);
			range.setEndAfter(tabNode);
			return;
		}

		// Start collecting markdown symbols
		if (event.key === 'Enter') {
			markdownBuffer = '';
		} else if (event.key === '#' || event.key === '-' || event.key === '*') {
			markdownBuffer += event.key;
		} else if (event.key === ' ' && markdownBuffer) {
			event.preventDefault();
			const range = selection.getRangeAt(0);
			const currentLine = range.startContainer.textContent || '';

			// Handle headings
			if (markdownBuffer.startsWith('#')) {
				const level = Math.min(markdownBuffer.length, 4);
				document.execCommand('formatBlock', false, `h${level}`);
				const selection = window.getSelection();
				if (selection) {
					const node = selection.anchorNode;
					if (node && node.nodeType === 3) {
						const parent = node.parentNode;
						if (parent && parent.nodeName === `H${level}`) {
							const sizes = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl'];
							(parent as HTMLElement).classList.add(sizes[level - 1]);
						}
					}
				}
			}
			// Handle lists
			else if (markdownBuffer === '-' || markdownBuffer === '*') {
				const ul = document.createElement('ul');
				ul.className = 'list-inside list-disc';
				const li = document.createElement('li');
				ul.appendChild(li);
				range.setStart(range.startContainer, 0);
				range.deleteContents();
				range.insertNode(ul);
				li.focus();
			}
			markdownBuffer = '';
		} else {
			markdownBuffer = '';
		}
	}

	function format(command: string, imgString?: string) {
		document.execCommand(command, false, imgString);
		if (command === 'heading') {
			document.execCommand('formatBlock', false, 'h2');
			const selection = window.getSelection();
			if (selection) {
				const node = selection.anchorNode;
				if (node && node.nodeType === 3) {
					const parent = node.parentNode;
					if (parent && parent.nodeName === 'H2') {
						(parent as HTMLElement).classList.add('text-2xl');
					}
				}
			}
		}
		if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
			// Hot-patch the execCommand to add classes to the stuff
			const selection = window.getSelection();
			if (selection) {
				let node = selection.anchorNode;
				const tagName = command === 'insertUnorderedList' ? 'UL' : 'OL';
				while (node && node.nodeName !== tagName) {
					node = node.parentNode;
				}
				if (node && node.nodeName === tagName) {
					(node as HTMLElement).classList.add(
						'list-inside',
						tagName === 'UL' ? 'list-disc' : 'list-decimal'
					);
				}
			}
		}
	}
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
			<Card.Root class="w-[305px] lg:w-full">
				<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
					<p>Post by HireLATAM</p>
				</Card.Title>
			</Card.Root>

			<rt-editor
				class="relative max-h-[500px] w-full overflow-auto rounded-md border border-slate-300 pb-2"
			>
				<div
					class="sticky top-0 z-10 flex w-full flex-wrap gap-2 rounded-md border border-slate-100 bg-white p-2"
				>
					<Button aria-label="Undo" onclick={() => format('undo')}>
						<Undo />
					</Button>
					<Button aria-label="Redo" onclick={() => format('redo')}>
						<Redo />
					</Button>
					<ToggleGroup.Root type="single">
						<ToggleGroup.Item
							value="heading"
							aria-label="heading"
							onclick={() => format('heading')}
						>
							<Heading />
						</ToggleGroup.Item></ToggleGroup.Root
					>
					<ToggleGroup.Root type="multiple">
						<ToggleGroup.Item value="bold" aria-label="Bold" onclick={() => format('bold')}>
							<Bold />
						</ToggleGroup.Item>
						<ToggleGroup.Item value="italic" aria-label="Italic" onclick={() => format('italic')}>
							<Italic />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="underline"
							aria-label="Underline"
							onclick={() => format('underline')}
						>
							<Underline />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="strikethrough"
							aria-label="Strikethrough"
							onclick={() => format('strikethrough')}
						>
							<Strikethrough />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
					<ToggleGroup.Root type="single">
						<ToggleGroup.Item
							value="justifyLeft"
							aria-label="Align Left"
							onclick={() => format('justifyLeft')}
						>
							<AlignLeft />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="justifyCenter"
							aria-label="Align Center"
							onclick={() => format('justifyCenter')}
						>
							<AlignCenter />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="justifyRight"
							aria-label="Align Right"
							onclick={() => format('justifyRight')}
						>
							<AlignRight />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
					<ToggleGroup.Root type="single">
						<ToggleGroup.Item
							value="insertUnorderedList"
							aria-label="Bullet List"
							onclick={() => format('insertUnorderedList')}
						>
							<List />
						</ToggleGroup.Item>
						<ToggleGroup.Item
							value="insertOrderedList"
							aria-label="Numbered List"
							onclick={() => format('insertOrderedList')}
						>
							<ListOrdered />
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</div>
				<div class="relative mx-3 mt-4 h-full min-h-[150px]">
					<div
						class="contenteditable h-full min-h-60 focus:outline-none"
						contenteditable="true"
						data-placeholder="Start typing here..."
						onkeydown={handleKeydown}
					></div>
				</div>
			</rt-editor>
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

<style>
	.contenteditable:empty::before {
		content: attr(data-placeholder);
		color: #a0aec0; /* Light placeholder text color */
		pointer-events: none;
	}
</style>
