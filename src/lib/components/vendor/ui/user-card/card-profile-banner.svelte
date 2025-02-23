<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	function getInitials(name: string): string {
		const [firstName, lastName] = name.split(' ');
		return (firstName[0] + (lastName ? lastName[0] : '')).toUpperCase();
	}
	let {
		ref = $bindable(null),
		class: className,
		accent,
		image,
		name,
		username,
		hireable,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		accent?: string;
		image?: string;
		name?: string;
		username?: string;
		hireable?: boolean;
	} = $props();

	let accent_color = $state('');

	onMount(() => {
		if (image) {
			getAccentColor(image);
		}
	});

	// This is a browser-only function
	async function getAccentColor(url: string) {
		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;

		await new Promise((resolve) => (img.onload = resolve));

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = 1;
		canvas.height = 1;

		if (ctx === null) {
			throw new Error('Could not get 2d context');
		}

		ctx.drawImage(img, 0, 0, 1, 1); // Resize to 1x1
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

		accent_color = `rgb(${r},${g},${b})`;
	}
</script>

<div bind:this={ref} class={cn(className)} {...restProps} style="block-size: 160px;">
	<div
		class={cn('accent-block shrink-0', accent)}
		style={`inline-size: 100%; block-size: 107px; background-color: ${accent_color}`}
	></div>
	<avatar-wrapper class="flex w-full items-center pr-12">
		<Avatar.Root
			class={cn(hireable ? 'border-8 border-success' : '', 'mx-4 size-28')}
			style="margin-block-start: -3rem"
		>
			<Avatar.Image src={image} alt={'@' + username} />
			<Avatar.Fallback>
				{#if name}
					{getInitials(name)}
				{:else}
					{username ? username.toUpperCase() : ''}
				{/if}</Avatar.Fallback
			>
		</Avatar.Root></avatar-wrapper
	>
	{@render children?.()}
</div>
