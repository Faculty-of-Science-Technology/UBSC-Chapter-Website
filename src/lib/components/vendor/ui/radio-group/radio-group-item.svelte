<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
	import Circle from 'lucide-svelte/icons/circle';

	let {
		ref = $bindable(null),
		class: className,
		name = '',
		form = '',
		value = $bindable(),
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> & {
		value: string;
	} = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	{value}
	class={cn(
		'aspect-square size-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="relative float-left flex h-full w-fit cursor-pointer items-center gap-2">
			{#if checked}
				<input
					type="hidden"
					class={cn('left-0 top-0 z-10 w-full opacity-0')}
					{form}
					{name}
					{value}
				/>
				<Circle class="absolute left-0 top-0 size-3.5 fill-primary" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
