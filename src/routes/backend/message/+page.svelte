<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';
	interface MessageData {
		data: PageData;
	}
	let { data }: MessageData = $props();
	let authenticated: boolean = $state(false);
	onMount(() => {
		if (data.authenticated) {
			try {
				authenticated = JSON.parse(data.authenticated);
			} catch (e) {
				authenticated = false;
			}
		}
	});
</script>

<page class="mx-2 my-8 flex flex-col space-y-5 lg:mx-8">
	<section class="header text-archivo flex flex-col space-y-1">
		<h1 class="text-5xl font-extralight lg:text-6xl">{data.message_title}</h1>
		<p class="text-lg lg:text-2xl">{data.message_description}</p>
	</section>
	<Card.Root class="w-[305px] pb-2 lg:w-full">
		<Card.Title class="items-center justify-center px-6 py-2 text-left text-2xl">
			{@html data.message_title2}
		</Card.Title>
		<card-description class="flex flex-col gap-2 px-6">
			<p>{data.message_description2}</p>

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
