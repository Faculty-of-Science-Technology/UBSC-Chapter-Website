<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar/index.js';
	import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as Command from '$lib/components/vendor/ui/command';
	import CommandItem2 from '$lib/components/vendor/ui/command/command-item2.svelte';
	import * as Form from '$lib/components/vendor/ui/form';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Separator } from '$lib/components/vendor/ui/separator';
	import Switch from '$lib/components/vendor/ui/switch/switch.svelte';
	import * as Tabs from '$lib/components/vendor/ui/tabs';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import { cn } from '$lib/components/vendor/utils';
	import type { GeoJSON, ReverseGeoJSON } from '$lib/types/GeoJSON';
	import { getReverseLoc } from '$lib/utility/utility';
	import {
		Building,
		FileText,
		Github,
		Globe,
		House,
		Linkedin,
		Locate,
		Map,
		PenLine,
		Plus,
		Twitter,
		Upload,
		User,
		X
	} from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { type PageProps } from './$types';

	const { data }: PageProps = $props();
	const user = data.user;

	// Form setup
	let skills = $state<string[]>([]);
	let skillInput = $state('');
	let resumeUploadIsDragOver = $state(false);
	let activeTab = $state('general');

	// Location search functionality
	let backoff = 500;
	let timeout: ReturnType<typeof setTimeout>;
	let cityData: GeoJSON | null = $state(null);
	let location: GeolocationCoordinates | (string | null) = null;
	let translated_location: string | null = null;

	async function queryLocations(location: string): Promise<GeoJSON> {
		const response = await fetch(`https://photon.komoot.io/api/?q=${location}&limit=5`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		cityData = data;
		return data;
	}

	function addSkill() {
		if (skillInput && !$form.skills.includes(skillInput)) {
			$form.skills = [...$form.skills, skillInput.trim()];
			skillInput = '';
		}
	}

	function removeSkill(skill: string) {
		$form.skills = $form.skills.filter((s) => s !== skill);
	}

	// Social links interface
	interface SocialLink {
		platform: string;
		url: string;
		icon: any;
		placeholder: string;
	}

	const socialPlatforms: Record<string, SocialLink> = {
		GitHub: {
			platform: 'GitHub',
			url: '',
			icon: Github,
			placeholder: 'https://github.com/yourusername'
		},
		LinkedIn: {
			platform: 'LinkedIn',
			url: '',
			icon: Linkedin,
			placeholder: 'https://linkedin.com/in/yourusername'
		},
		Twitter: {
			platform: 'Twitter',
			url: '',
			icon: Twitter,
			placeholder: 'https://twitter.com/yourusername'
		},
		'Personal Website': {
			platform: 'Personal Website',
			url: '',
			icon: Globe,
			placeholder: 'https://your-website.com'
		}
	};

	// Initialize the form
	const form_object = superForm(data.form, {
		scrollToError: true,
		resetForm: false,
		invalidateAll: false,
		dataType: 'json'
	});

	const { form, errors, message, constraints, enhance } = form_object;
</script>

{#if user}
	<div class="flex flex-col gap-8">
		<!-- Page Header -->
		<div>
			<h1 class="text-3xl font-semibold tracking-tight">Profile Settings</h1>
			<p class="text-muted-foreground">
				Manage your personal information and how others see you on the platform
			</p>
		</div>

		{#if $message}
			<div class="rounded-md border border-green-200 bg-green-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-green-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">Success!</h3>
						<div class="mt-2 text-sm text-green-700">
							<p>{$message}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		{#if $errors._errors}
			<div class="rounded-md border border-red-200 bg-red-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg
							class="h-5 w-5 text-red-400"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<div class="mt-2 text-sm text-red-700">
							<p>{$errors._errors}</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- User Profile Preview -->
		<div class="flex items-center gap-4 rounded-lg border bg-white p-4">
			<Avatar.Root class="h-16 w-16">
				<Avatar.Image src={user.ProfilePicture} alt={user.FirstName + ' ' + user.LastName} />
				<Avatar.Fallback>{user.FirstName?.[0]}{user.LastName?.[0]}</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<h2 class="text-lg font-medium">{user.FirstName} {user.LastName}</h2>
				<p class="text-sm text-muted-foreground">{user.Email}</p>
				<div class="mt-2">
					{#if user.AccountType === 'student'}
						<a href="/dashboard/people/{user.Id}">
							<Button variant="outline" size="sm" class="gap-2">
								<User size={14} />
								View public profile
							</Button>
						</a>
					{:else if user.AccountType === 'org'}
						<a href="/dashboard/organizations/{user.Id}">
							<Button variant="outline" size="sm" class="gap-2">
								<Building size={14} />
								View organization
							</Button>
						</a>
					{:else}
						<a href="/dashboard/people/{user.Id}">
							<Button variant="outline" size="sm" class="gap-2">
								<User size={14} />
								View public profile
							</Button>
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Settings Tabs -->
		<Tabs.Root value={activeTab} onValueChange={(v) => (activeTab = v)} class="w-full">
			<Tabs.List class="w-full border-b">
				<Tabs.Trigger value="general" class="flex gap-2 data-[state=active]:border-primary">
					<User size={16} />
					General
				</Tabs.Trigger>
				<Tabs.Trigger value="skills" class="flex gap-2 data-[state=active]:border-primary">
					<FileText size={16} />
					Skills & Availability
				</Tabs.Trigger>
				<Tabs.Trigger value="socials" class="flex gap-2 data-[state=active]:border-primary">
					<Globe size={16} />
					Social Links
				</Tabs.Trigger>
			</Tabs.List>

			<form method="POST" id="profile-form" enctype="multipart/form-data" use:enhance class="mt-6">
				<!-- General Information Tab -->
				<Tabs.Content value="general" class="space-y-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Basic Information</Card.Title>
							<Card.Description
								>Update your personal details and contact information</Card.Description
							>
						</Card.Header>
						<Card.Content class="space-y-6">
							<!-- Username -->
							<div class="space-y-2">
								<Label for="username">Username</Label>
								<Input
									id="username"
									{...$constraints.username}
									placeholder="@username"
									name="username"
									bind:value={$form.username}
								/>
								{#if $errors.username}
									<p class="text-sm text-destructive">{$errors.username}</p>
								{/if}
								<p class="text-sm text-muted-foreground">
									{#if user.AccountType === 'student'}
										This is your public display name. It can be your real name or a pseudonym.
									{:else if user.AccountType === 'org'}
										This is your organization's public display name.
									{:else}
										This is your public display name. It can be your real name or a pseudonym.
									{/if}
								</p>
							</div>

							<!-- Phone -->
							<div class="space-y-2">
								<Label for="phone">Phone Number</Label>
								<Input
									id="phone"
									{...$constraints.phone}
									placeholder="501 601-0123"
									type="tel"
									name="phone"
									bind:value={$form.phone}
								/>
								{#if $errors.phone}
									<p class="text-sm text-destructive">{$errors.phone}</p>
								{/if}
								<p class="text-sm text-muted-foreground">
									Providing a phone number is optional but can help employers contact you.
								</p>
							</div>

							<!-- Email -->
							<div class="space-y-2">
								<Label for="email">Email</Label>
								<Form.Field form={form_object} name="email">
									<Form.Control>
										{#snippet children({ props })}
											<Select.Root type="single" name="email" bind:value={$form.email}>
												<Select.Trigger class="w-full">
													{$form.email ? $form.email : 'Select a verified email to display'}
												</Select.Trigger>
												<Select.Content>
													<Select.Item value={user.Email} label={user.Email} />
												</Select.Content>
											</Select.Root>
										{/snippet}
									</Form.Control>
								</Form.Field>
								<p class="text-sm text-muted-foreground">
									This is your verified email address. Email management is not yet available.
								</p>
							</div>

							<!-- Bio -->
							<div class="space-y-2">
								<Label for="bio">Bio</Label>
								<Textarea
									id="bio"
									name="bio"
									bind:value={$form.bio}
									{...$constraints.bio}
									placeholder="Tell others about yourself or your organization"
									class="min-h-[120px]"
								/>
								{#if $errors.bio}
									<p class="text-sm text-destructive">{$errors.bio}</p>
								{/if}
								<p class="text-sm text-muted-foreground">
									Write a brief bio to introduce yourself to other users.
								</p>
							</div>

							<!-- Location -->
							<div class="space-y-2">
								<Label for="location">Location</Label>
								<Command.Root class="rounded-lg border">
									<Command.Input
										id="location"
										class="w-full"
										name="location"
										bind:value={$form.location}
										onkeydown={(e) => {
											if (e.key === 'Enter') {
												const target = e.target as HTMLInputElement;
												clearTimeout(timeout);
												timeout = setTimeout(async () => {
													await queryLocations(target.value);
												}, backoff);
											}
										}}
										oninput={async (e: Event) => {
											const target = e.target as HTMLInputElement;
											if (target === null || target.value === '') {
												cityData = null;
												return;
											}
											clearTimeout(timeout);
											timeout = setTimeout(async () => {
												await queryLocations(target.value);
											}, backoff);
										}}
										placeholder="Type a location to search..."
									/>

									{#if cityData && cityData.features.length > 0}
										<Command.List title="Search results">
											{#each cityData.features as city}
												<CommandItem2
													onclick={async () => {
														const lat = city.geometry.coordinates[1];
														const lng = city.geometry.coordinates[0];
														const reverse_location: ReverseGeoJSON | null = await getReverseLoc(
															lat,
															lng
														);
														if (!reverse_location) return;
														translated_location = reverse_location.display_name;
														localStorage.setItem(
															'location',
															JSON.stringify({ latitude: lat, longitude: lng })
														);
														$form.location = translated_location;
													}}
													data-lat={city.geometry.coordinates[1]}
													data-lng={city.geometry.coordinates[0]}
												>
													{#if city.properties.type === 'other'}
														<Map class="mr-2 h-4 w-4" />
													{:else if city.properties.type === 'state'}
														<Locate class="mr-2 h-4 w-4" />
													{:else if city.properties.type === 'country'}
														<Map class="mr-2 h-4 w-4" />
													{:else if city.properties.type === 'county'}
														<House class="mr-2 h-4 w-4" />
													{:else if city.properties.type === 'city' || city.properties.type === 'district'}
														<Building class="mr-2 h-4 w-4" />
													{/if}
													<div>
														<div>{@html city.properties.name.replace(/"/g, '&quot;')}</div>
														<div class="text-xs font-light">
															{@html city.properties.country.replace(/"/g, '&quot;')}
														</div>
													</div>
													<Command.Shortcut
														>{@html (
															(city.properties.type ?? '').charAt(0).toUpperCase() +
															(city.properties.type ?? '').slice(1).toLowerCase()
														)
															.toString()
															.replace(/"/g, '&quot;')}</Command.Shortcut
													>
												</CommandItem2>
											{/each}
										</Command.List>
									{:else if cityData}
										<Command.Empty>No results found. Try a different search term.</Command.Empty>
									{/if}
								</Command.Root>
								<p class="text-sm text-muted-foreground">
									Where you are currently based. This helps with location-based recommendations.
								</p>
							</div>

							<!-- Resume Upload -->
							<div class="space-y-2">
								<Label for="resume">Resume</Label>
								<div
									role="button"
									tabindex="0"
									aria-label="Upload resume"
									class={cn(
										'flex flex-col items-center justify-center rounded-md border border-dashed p-6 transition-colors',
										resumeUploadIsDragOver
											? 'border-primary bg-primary/5'
											: 'border-muted-foreground/25'
									)}
									ondragover={(e) => {
										e.preventDefault();
										resumeUploadIsDragOver = true;
									}}
									ondragleave={() => (resumeUploadIsDragOver = false)}
									ondrop={(e) => {
										e.preventDefault();
										resumeUploadIsDragOver = false;
										if (e.dataTransfer?.files.length) {
											$form.resume = e.dataTransfer.files[0];
										}
									}}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											document.getElementById('resume')?.click();
										}
									}}
								>
									<div class="flex flex-col items-center gap-1.5">
										<Upload class="h-8 w-8 text-muted-foreground" />
										{#if $form.resume}
											<p class="text-sm font-medium">Selected: {$form.resume.name}</p>
											<p class="text-xs text-muted-foreground">
												{($form.resume.size / 1024 / 1024).toFixed(2)} MB
											</p>
										{:else}
											<p class="text-sm font-medium">Drag & drop your resume here</p>
											<p class="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max 5MB)</p>
										{/if}
										<Input
											name="resume"
											type="file"
											id="resume"
											accept=".pdf,.docx,.txt"
											oninput={(e) => ($form.resume = e.currentTarget.files?.item(0) as File)}
											{...$constraints.resume}
											class="hidden"
										/>
										<Button
											variant="outline"
											size="sm"
											type="button"
											class="mt-2"
											onclick={() => document.getElementById('resume')?.click()}
										>
											Browse files
										</Button>
									</div>
								</div>
								{#if user.ResumeUrl && user.AccountType === 'student'}
									<div class="flex items-center gap-2 text-sm">
										<FileText class="h-4 w-4 text-muted-foreground" />
										<a
											href={user.ResumeUrl}
											target="_blank"
											class="font-medium hover:text-primary hover:underline"
										>
											View current resume
										</a>
									</div>
								{/if}
								{#if $errors.resume}
									<p class="text-sm text-destructive">{$errors.resume}</p>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- Skills & Availability Tab -->
				<Tabs.Content value="skills" class="space-y-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Skills and Availability</Card.Title>
							<Card.Description>
								Showcase your expertise and let others know your availability status
							</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-6">
							<!-- Availability Status -->
							<div class="space-y-2">
								<h3 class="text-sm font-medium leading-none">
									{#if user.AccountType === 'student'}
										Employment Status
									{:else if user.AccountType === 'org'}
										Hiring Status
									{:else}
										Employment Status
									{/if}
								</h3>
								<div class="flex items-center gap-4 rounded-md border p-4">
									<Switch id="hireable" name="hireable" bind:checked={$form.hireable} />
									<div>
										<Label for="hireable" class="text-base">
											{#if user.AccountType === 'student'}
												Available for hire
											{:else if user.AccountType === 'org'}
												Actively hiring
											{:else}
												Available for hire
											{/if}
										</Label>
										<p class="text-sm text-muted-foreground">
											{#if user.AccountType === 'student'}
												Let employers know you're open to work opportunities
											{:else if user.AccountType === 'org'}
												Let applicants know you're currently looking to hire
											{:else}
												Let employers know you're open to work opportunities
											{/if}
										</p>
									</div>
								</div>
							</div>

							<!-- Skills -->
							<div class="space-y-3">
								<h3 class="text-sm font-medium leading-none">
									{#if user.AccountType === 'student'}
										Skills
									{:else if user.AccountType === 'org'}
										Relevant Skills for Your Organization
									{:else}
										Skills
									{/if}
								</h3>
								<p class="text-sm text-muted-foreground">
									{#if user.AccountType === 'student'}
										Add skills that showcase your expertise
									{:else if user.AccountType === 'org'}
										Add skills your organization is looking for
									{:else}
										Add skills that showcase your expertise
									{/if}
								</p>

								<div class="flex flex-wrap gap-2 pt-2">
									{#each $form.skills as skill}
										<Badge variant="secondary" class="items-center gap-1 px-2 py-1">
											{skill}
											<button
												type="button"
												class="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
												onclick={() => removeSkill(skill)}
											>
												<X class="h-3 w-3" />
												<span class="sr-only">Remove {skill}</span>
											</button>
										</Badge>
									{/each}

									{#if $form.skills.length === 0}
										<p class="text-sm text-muted-foreground">No skills added yet</p>
									{/if}
								</div>

								<div class="flex gap-2">
									<Input
										type="text"
										placeholder="Type a skill and press Enter"
										bind:value={skillInput}
										onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
										class="flex-1"
									/>
									<Button type="button" size="icon" onclick={addSkill}>
										<Plus class="h-4 w-4" />
										<span class="sr-only">Add skill</span>
									</Button>
								</div>

								{#if $form.skills.length >= 12}
									<p class="text-sm text-amber-600">
										You can add up to {15 - $form.skills.length} more skill(s)
									</p>
								{/if}

								{#if typeof $errors.skills === 'object' && $errors.skills}
									<p class="text-sm text-destructive">
										{Object.values($errors.skills).join(', ')}
									</p>
								{:else if $errors.skills}
									<p class="text-sm text-destructive">{$errors.skills}</p>
								{/if}

								<div class="mt-2 rounded-md bg-muted/50 p-4">
									<h4 class="text-sm font-medium">Suggested Skills</h4>
									<div class="mt-2 flex flex-wrap gap-2">
										<Button
											variant="outline"
											size="sm"
											type="button"
											onclick={() => {
												skillInput = 'JavaScript';
												addSkill();
											}}>JavaScript</Button
										>
										<Button
											variant="outline"
											size="sm"
											type="button"
											onclick={() => {
												skillInput = 'Python';
												addSkill();
											}}>Python</Button
										>
										<Button
											variant="outline"
											size="sm"
											type="button"
											onclick={() => {
												skillInput = 'SQL';
												addSkill();
											}}>SQL</Button
										>
										<Button
											variant="outline"
											size="sm"
											type="button"
											onclick={() => {
												skillInput = 'React';
												addSkill();
											}}>React</Button
										>
										<Button
											variant="outline"
											size="sm"
											type="button"
											onclick={() => {
												skillInput = 'Node.js';
												addSkill();
											}}>Node.js</Button
										>
									</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- Social Links Tab -->
				<Tabs.Content value="socials" class="space-y-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Social Links</Card.Title>
							<Card.Description>Connect your social profiles to your account</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-6">
							{#each Object.keys(socialPlatforms) as platform, index}
								{#snippet platformIcon(platform: SocialLink)}
									{#if platform !== undefined}
										<platform.icon class="h-5 w-5" />
									{:else}
										<Globe class="h-5 w-5" />
									{/if}
								{/snippet}

								<div class="space-y-1">
									<input
										type="hidden"
										value={$form.socials.find((s) => s.platform === platform)?.platform || platform}
										name="socials[{socialPlatforms[platform].platform}].platform"
									/>

									<div class="flex items-center gap-2">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
										>
											{@render platformIcon(socialPlatforms[platform])}
										</div>
										<div class="flex-1">
											<Label>{platform}</Label>
											<Input
												type="url"
												name="socials[{socialPlatforms[platform].platform}].url"
												placeholder={socialPlatforms[platform].placeholder}
												bind:value={$form.socials[
													$form.socials.findIndex((s) => s.platform === platform)
												].url}
												class="mt-1"
											/>
										</div>
									</div>

									{#if $errors.socials && $errors.socials[index]}
										<p class="text-sm text-destructive">{$errors.socials[index].url}</p>
									{/if}

									{#if index < Object.keys(socialPlatforms).length - 1}
										<Separator class="my-4" />
									{/if}
								</div>
							{/each}

							<p class="text-sm text-muted-foreground">
								{#if user.AccountType === 'student'}
									Add links to your profiles so employers can learn more about your work
								{:else if user.AccountType === 'org'}
									Add links to your company's online presence
								{:else}
									Add links to your profiles so others can learn more about you
								{/if}
							</p>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>

				<!-- Submit Button -->
				<div class="mt-8 flex justify-end">
					<Button type="submit" class="gap-2">
						<PenLine size={16} />
						Save changes
					</Button>
				</div>
			</form>
		</Tabs.Root>
	</div>
{/if}
