<script lang="ts">
	// import * as UserCard from '$lib/components/vendor/ui/user-card';

	// import Badge from '$lib/components/vendor/ui/badge/badge.svelte';
	import Button from '$lib/components/vendor/ui/button/button.svelte';
	// import { Calendar } from 'lucide-svelte';
	import { type PageData } from './$types.js';

	const { data: props } = $props();
	const data: PageData = props;

	import CommandItem2 from '$lib/components/vendor/ui/command/command-item2.svelte';
	import { Input } from '$lib/components/vendor/ui/input/index.js';
	import * as Select from '$lib/components/vendor/ui/select/index.js';
	import { getReverseLoc } from '$lib/utility/utility';
	import { Building, House, Locate, Map } from 'lucide-svelte';

	import { Badge } from '$lib/components/vendor/ui/badge';
	import * as Command from '$lib/components/vendor/ui/command/index';
	import { Label } from '$lib/components/vendor/ui/label/index.js';
	import Switch from '$lib/components/vendor/ui/switch/switch.svelte';
	import { Textarea } from '$lib/components/vendor/ui/textarea/index.js';
	import type { GeoJSON, ReverseGeoJSON } from '$lib/types/GeoJSON';

	import * as Form from '$lib/components/vendor/ui/form/index';
	import { Github, Globe, Linkedin, Plus, Twitter, X } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let skills = $state<string[]>([]);
	let skillInput = $state('');
	let user = data.user;

	let backoff = 500;
	let timeout: ReturnType<typeof setTimeout>;
	let cityData: GeoJSON | null = $state(null);

	// ---
	let location: GeolocationCoordinates | (string | null) = null;
	let translated_location: string | null = null;

	// Get the current location
	async function queryLocations(location: string): Promise<GeoJSON> {
		const response = await fetch(`https://photon.komoot.io/api/?q=${location}&limit=5`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		cityData = data;
		cityData = cityData;
		return data;
	}

	function addSkill() {
		if (skillInput && !skills.includes(skillInput)) {
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

	// Initialize the form
	const form_object = superForm(data.form, {
		scrollToError: true,
		resetForm: false,
		invalidateAll: false,
		dataType: 'json'
	});

	const { form, errors, message, constraints, enhance } = form_object;
</script>

<!-- <SuperDebug data={form} /> -->

{#if user}
	<section>
		<section class="header text-archivo flex flex-col space-y-1 pb-8">
			<h1 class="text-5xl font-extralight lg:text-6xl">Your Profile</h1>
			<p class="text-lg lg:text-2xl">Manage and setup your profile</p>
		</section>
		<form method="POST" class="space-y-8" id="profile-form" use:enhance>
			<div class="grid w-full max-w-sm items-center gap-8">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label>Appearance</Label>
					<p class="text-sm text-muted-foreground">
						Edit things like your profile image or cover photo
					</p>
					<a href="/dashboard/people/{user.Id}">
						<Button>View my profile</Button>
					</a>
				</div>
				<div class="grid w-full max-w-sm items-center gap-8">
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="username">Username</Label>
						<p class="text-sm text-destructive">{$errors.username}</p>
						<Input
							{...$constraints.username}
							placeholder="@alexdev404"
							name="username"
							bind:value={$form.username}
						/>
						<p class="text-sm text-muted-foreground">
							This is your public display name. It can be your real name or a pseudonym. You can
							only change this once every 30 days.
						</p>
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="username">Phone</Label>
						<p class="text-sm text-destructive">{$errors.phone}</p>
						<Input
							{...$constraints.phone}
							placeholder="501 601-0123"
							type="tel"
							name="phone"
							bind:value={$form.phone}
						/>
						<p class="text-sm text-muted-foreground">
							This is your public phone number. You do not need to provide it, but it is recommended
							that you do.
						</p>
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Label for="email">Email</Label>
							<p class="text-sm text-destructive">{$errors.email}</p>

							<!-- Select Component form compatibility-layer wrapper -->
							<Form.Field form={form_object} name="email">
								<Form.Control>
									{#snippet children({ props })}
										<Select.Root type="single" name="email" bind:value={$form.email}>
											<!-- selected={selectedEmail}
						onSelectedChange={(s) => {
							s && ($formData.email = s.value);
							}} -->
											<Select.Trigger>
												{$form.email
													? $form.email
													: 'Select a verified email to display'}</Select.Trigger
											>
											<Select.Content>
												<!-- @todo Make email address display dynamic -->
												<Select.Item value={user.Email} label={user.Email} />
												<!-- @todo Finish implementing this -->
												<!-- <Dialog.Root>
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
									</Dialog.Root> -->
											</Select.Content>
										</Select.Root>
									{/snippet}
								</Form.Control>
							</Form.Field>
							<!-- <input hidden name={attrs.name} bind:value={$formData.email} /> -->
						</div>
						<p class="text-sm text-muted-foreground">
							It is not yet possible to manage or change verified email addresses.
						</p>
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Label for="bio">Bio</Label>
							<Textarea
								name="bio"
								bind:value={$form.bio}
								{...$constraints.bio}
								placeholder="Hey there, welcome to my profile. Feel free to get in touch or leave a message!"
							/>
						</div>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="location">Location</Label>
						<p class="text-sm text-muted-foreground">Where are you currently based?</p>
						<Command.Root class="w-full rounded-lg border">
							<Command.Input
								class="w-full"
								name="location"
								bind:value={$form.location}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										const target = e.target as HTMLInputElement;
										clearTimeout(timeout);
										timeout = setTimeout(async () => {
											await queryLocations(target.value);
											console.log(cityData);
										}, backoff);
									}
								}}
								oninput={async (e: Event) => {
									const target = e.target as HTMLInputElement;
									if (target === null || target.value === '') {
										console.log('target is null');
										cityData = null;
										return;
									}
									console.log(target.value);
									clearTimeout(timeout);
									timeout = setTimeout(async () => {
										await queryLocations(target.value);
										console.log(cityData);
									}, backoff);
								}}
								placeholder="Type a location or search..."
							/>

							{#if cityData}
								{#if cityData && cityData.features.length > 0}
									<!-- Search results -->
									<Command.List title="Search results">
										{#each cityData.features as city}
											<!-- {city.properties.name} -->
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
								{:else}
									<Command.Empty>No results found.</Command.Empty>
								{/if}
							{/if}
						</Command.Root>
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label>Employment Status</Label>
						<div class="flex items-center space-x-2">
							<Switch id="hireable" name="hireable" bind:checked={$form.hireable} />
							<Label for="hireable">Available for hire</Label>
						</div>
						<p class="text-sm text-muted-foreground">
							Let employers know you're open to opportunities
						</p>
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label>Skills</Label>
						<p class="text-sm text-muted-foreground">Add skills that showcase your expertise</p>
						<div class="flex flex-wrap gap-2">
							{#each $form.skills as skill}
								<Badge variant="secondary" class="gap-1">
									{skill}
									<button type="button" class="ml-1" onclick={() => removeSkill(skill)}>
										<X class="h-3 w-3" />
									</button>
								</Badge>
							{/each}
						</div>
						<div class="flex gap-2">
							<Input
								type="text"
								placeholder="Add a skill and press Enter"
								bind:value={skillInput}
								onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
							/>
							<Button type="button" variant="outline" size="icon" onclick={addSkill}>
								<Plus class="h-4 w-4" />
							</Button>
						</div>
						<p class="text-sm text-muted-foreground">Examples: JavaScript, Team Building</p>
						<p class="text-sm text-destructive">
							{typeof $errors.skills === 'object'
								? Object.values($errors.skills).join(', ')
								: $errors.skills}
						</p>
						{#if $form.skills.length >= 12}
							<p class="text-sm text-destructive">
								You can add up to {15 - $form.skills.length} more skill(s).
							</p>
						{/if}
					</div>

					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label>Social Links</Label>
						<div class="flex flex-col gap-4">
							{#each socialPlatforms as platform, index}
								<div class="flex items-center gap-2">
									<platform.icon class="h-4 w-4" />
									<input
										type="hidden"
										value={$form.socials[index].platform}
										name="socials[{platform.platform}].platform"
									/>
									<Input
										type="url"
										name="socials[{platform.platform}].url"
										placeholder={platform.placeholder}
										bind:value={$form.socials[index].url}
										oninput={(e) => {
											if ($form.socials[index].url !== platform.platform) {
												$form.socials[index].platform = platform.platform;
											}
										}}
										class="flex-1"
									/>
								</div>
							{/each}
						</div>
						<p class="text-sm text-muted-foreground">
							Add links to your profiles so employers can learn more about your work
						</p>
					</div>

					<div class="flex flex-col space-y-1">
						<Button type="submit">Update profile</Button>
						<p class="text-sm text-destructive">
							{$errors._errors}
						</p>
						<p class="text-sm text-success">{$message}</p>
					</div>
				</div>
			</div>
		</form>
	</section>
{/if}
