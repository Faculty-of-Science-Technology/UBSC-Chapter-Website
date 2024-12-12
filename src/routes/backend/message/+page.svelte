<script>
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	let title = 'Finish Application';
	let description = 'Response recorded.';
	let title_2 = 'Remote Senior Backend Software Engineer &mdash; HireLATAM';
	let description_2 =
		'Thank you for your interest in this job opportunity. Check your email or dashboard for updates.';
	let authenticated = false;
</script>

<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">{title}</h1>
		<p class="text-lg lg:text-2xl">{description}</p>
	</section>
	<Card.Root class="w-[305px] pb-2 lg:w-full">
		<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
			{@html title_2}
		</Card.Title>
		<card-description class="flex flex-col gap-2 px-6">
			<p>{description_2}</p>

			<action-container class="flex w-full flex-row">
				{#if authenticated}
					<Button class="w-fit" onclick={() => goto('/auth/register')}>Return to dashboard</Button>
				{:else}
					<Button class="w-fit" onclick={() => goto('/')}>Return Home</Button>
				{/if}
			</action-container>
		</card-description>
	</Card.Root>
</page>
