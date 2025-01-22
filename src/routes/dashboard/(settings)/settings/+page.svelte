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

	import { Label } from '$lib/components/vendor/ui/label/index.js';
	import { Textarea } from '$lib/components/vendor/ui/textarea/index.js';
	import { cn } from '$lib/components/vendor/utils.js';
	import { PlusIcon } from 'lucide-svelte';
</script>

<section>
	<section class="header text-archivo flex flex-col space-y-1 pb-8">
		<h1 class="text-5xl font-extralight lg:text-6xl">Your Profile</h1>
		<p class="text-lg lg:text-2xl">Manage and setup your profile</p>
	</section>
	<!-- <UserCard.Root class="mb-6 w-full">
		<UserCard.ProfileBanner accent="bg-red-200" />
		<UserCard.Content class="flex flex-col gap-4">
			<UserCard.Title>
				<h1>{user.FirstName + ' ' + user.LastName}</h1>
				<span class="tracking-wide">
					{#if user.Hireable}
						<Badge>Hireable</Badge>
					{/if}
				</span>
			</UserCard.Title>
			<card-description class="flex flex-col gap-2">
				<UserCard.Description>{user.Bio}</UserCard.Description>
				<div class="mb-4 flex flex-row items-center gap-2 text-xs text-slate-400">
					<Calendar strokeWidth="2" size="16" />
					<p>Joined {new Date(user.CreatedAt).toLocaleDateString()}</p>
				</div>
				<Button class="lg:w-fit">Edit Profile</Button>
			</card-description>
		</UserCard.Content>
	</UserCard.Root> -->

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
											<Input id="email" type="email" name="email" placeholder="Enter a new email address." class="col-span-3" />
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
					<Textarea name="bio" placeholder="Hey there, welcome to my profile. Feel free to get in touch or leave a message!" />
				</div>
			</div>
			<div>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<!--	<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="urls">URLs</Label>
						<!-- {#each $formData.urls as _, i}
					<Form.ElementField {form} name="urls[{i}]">
						<Form.Description class={cn(i !== 0 && "sr-only")}>
							Add links to your website, blog, or social media profiles.
						</Form.Description>
						<Form.Control let:attrs>
							<Input {...attrs} bind:value={$formData.urls[i]} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.ElementField>
				{/each} 
			</Form.Fieldset>
			
						<Button type="button" variant="outline" size="sm" class="mt-2" on:click={addUrl}>
							Add URL
						</Button>	
					</div> 
				</div>--->
					<Button>Update profile</Button>
				</div>
			</div>
		</div>
	</form>
</section>
