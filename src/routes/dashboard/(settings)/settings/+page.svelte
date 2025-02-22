<script lang="ts">
	// import * as UserCard from '$lib/components/vendor/ui/user-card';

	// import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import Button, { buttonVariants } from '$lib/components/vendor/ui/button/button.svelte';
	// import { Calendar } from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;
	const user = data.user;

	import * as Dialog from '$lib/components/vendor/ui/dialog/index.js';
	import { Input } from '$lib/components/vendor/ui/input/index.js';
	import * as Select from '$lib/components/vendor/ui/select/index.js';

	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Label } from '$lib/components/vendor/ui/label/index.js';
	import Switch from '$lib/components/vendor/ui/switch/switch.svelte';
	import { Textarea } from '$lib/components/vendor/ui/textarea/index.js';
	import { cn } from '$lib/components/vendor/utils.js';
	import { Github, Globe, Linkedin, Plus, PlusIcon, Twitter, X } from 'lucide-svelte';

	let skills = $state<string[]>([]);
	let skillInput = '';

	function addSkill() {
		if (skillInput && !skills.includes(skillInput)) {
			skills = [...skills, skillInput];
			skillInput = '';
		}
	}

	function removeSkill(skill: string) {
		skills = skills.filter((s) => s !== skill);
	}

	// Social links interface
	interface SocialLink {
		platform: string;
		url: string;
		icon: any;
		placeholder: string;
	}

	const socialPlatforms: SocialLink[] = [
		{
			platform: 'GitHub',
			url: '',
			icon: Github,
			placeholder: 'https://github.com/yourusername'
		},
		{
			platform: 'LinkedIn',
			url: '',
			icon: Linkedin,
			placeholder: 'https://linkedin.com/in/yourusername'
		},
		{
			platform: 'Twitter',
			url: '',
			icon: Twitter,
			placeholder: 'https://twitter.com/yourusername'
		},
		{
			platform: 'Personal Website',
			url: '',
			icon: Globe,
			placeholder: 'https://your-website.com'
		}
	];
</script>

<section>
	<section class="header text-archivo flex flex-col space-y-1 pb-8">
		<h1 class="text-5xl font-extralight lg:text-6xl">Your Profile</h1>
		<p class="text-lg lg:text-2xl">Manage and setup your profile</p>
	</section>
	<form method="POST" class="space-y-8" id="profile-form">
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="username">Username</Label>
				<Input placeholder="@alexdev404" />
				<p class="text-sm text-muted-foreground">
					This is your public display name. It can be your real name or a pseudonym. You can only
					change this once every 30 days.
				</p>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="email">Email</Label>
					<Select.Root type="single" name="favoriteFruit">
						<!-- selected={selectedEmail}
						onSelectedChange={(s) => {
							s && ($formData.email = s.value);
						}} -->
						<Select.Trigger>Select a verified email to display</Select.Trigger>
						<Select.Content>
							<!-- @todo Make email address display dynamic -->
							<Select.Item value="m@example.com" label="m@example.com" />
							<Dialog.Root>
								<Dialog.Trigger
									class={cn(
										buttonVariants({ variant: 'ghost' }),
										'w-full',
										'text-left',
										'justify-start'
									)}
									><PlusIcon class="mr-2 h-4 w-4" />
									Add new email
								</Dialog.Trigger>
								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>Attach new email</Dialog.Title>
										<Dialog.Description>
											Make changes to your profile here. Click save when you're done.
										</Dialog.Description>
									</Dialog.Header>
									<div class="grid gap-4 py-4">
										<div class="grid grid-cols-4 items-center gap-3">
											<Label for="email" class="text-left">Email</Label>
											<Input
												id="email"
												type="email"
												name="email"
												placeholder="Enter a new email address."
												class="col-span-3"
											/>
										</div>
									</div>
									<Dialog.Footer>
										<Button type="submit">Send verification link</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</Select.Content>
					</Select.Root>
					<!-- <input hidden name={attrs.name} bind:value={$formData.email} /> -->
				</div>
				<p class="text-sm text-muted-foreground">
					You can manage verified email addresses in your <a href="/examples/forms"
						>email settings</a
					>.
				</p>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="bio">Bio</Label>
					<Textarea
						name="bio"
						placeholder="Hey there, welcome to my profile. Feel free to get in touch or leave a message!"
					/>
				</div>
			</div>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label for="location">Location</Label>
				<Input type="text" id="location" name="location" placeholder="e.g. Belize City, Belize" />
				<p class="text-sm text-muted-foreground">Where are you currently based?</p>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label>Employment Status</Label>
				<div class="flex items-center space-x-2">
					<Switch id="hireable" name="hireable" />
					<Label for="hireable">Available for hire</Label>
				</div>
				<p class="text-sm text-muted-foreground">Let employers know you're open to opportunities</p>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label>Skills</Label>
				<div class="flex flex-wrap gap-2">
					{#each skills as skill}
						<Badge variant="secondary" class="gap-1">
							{skill}
							<button type="button" class="ml-1" on:click={() => removeSkill(skill)}>
								<X class="h-3 w-3" />
							</button>
						</Badge>
					{/each}
				</div>
				<div class="flex gap-2">
					<Input
						type="text"
						placeholder="Add a skill (e.g. JavaScript)"
						bind:value={skillInput}
						onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
					/>
					<Button type="button" variant="outline" size="icon" onclick={addSkill}>
						<Plus class="h-4 w-4" />
					</Button>
				</div>
				<p class="text-sm text-muted-foreground">Add skills that showcase your expertise</p>
			</div>

			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Label>Social Links</Label>
				<div class="flex flex-col gap-4">
					{#each socialPlatforms as platform}
						<div class="flex items-center gap-2">
							<platform.icon class="h-4 w-4" />
							<Input
								type="url"
								name="socials[{platform.platform}]"
								placeholder={platform.placeholder}
								class="flex-1"
							/>
						</div>
					{/each}
				</div>
				<p class="text-sm text-muted-foreground">
					Add links to your profiles so employers can learn more about your work
				</p>
			</div>

			<div>
				<Button>Update profile</Button>
			</div>
		</div>
	</form>
</section>
