<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
		class?: string;
		value?: string;
		name: string;
		form?: string;
	}
	let { class: className, value = $bindable(), ...restProps }: SelectProps = $props();
</script>

<select
	class={cn(
		'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	<slot />
</select>
