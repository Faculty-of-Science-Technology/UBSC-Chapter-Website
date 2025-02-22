<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
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
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		accent?: string;
		image?: string;
		name?: string;
		username?: string;
	} = $props();
</script>

<div bind:this={ref} class={cn(className)} {...restProps} style="block-size: 160px;">
	<div
		class="{cn(`accent-block ${accent ?? 'bg-slate-300'}`)} shrink-0"
		style="inline-size: 100%; block-size: 107px;"
	></div>
	<avatar-wrapper class="flex w-full items-center pr-12">
		<Avatar.Root class="mx-4 size-24" style="margin-block-start: -3rem">
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
