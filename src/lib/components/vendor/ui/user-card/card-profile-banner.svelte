<script lang="ts">
	import * as Avatar from '$lib/components/vendor/ui/avatar';
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		accent,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { accent?: string } = $props();
</script>

<div bind:this={ref} class={cn(className)} {...restProps} style="height: 160px;">
	<div
		class="{cn(`accent-block ${accent ?? 'bg-slate-300'}`)} shrink-0"
		style="width: 100%; height: 107px;"
	></div>
	<avatar-wrapper class="flex w-full items-center pr-12">
		<Avatar.Root class="mx-4 size-24" style="margin-top: -3rem">
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root></avatar-wrapper
	>
	{@render children?.()}
</div>
