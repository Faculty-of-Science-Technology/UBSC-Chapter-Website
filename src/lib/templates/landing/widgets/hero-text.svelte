<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';

	interface Props {
		prelude?: string;
		text?: string;
		text_light_blue?: string;
		subtitle?: string;
		class?: string;
	}

	let {
		prelude = '<no prelude provided>',
		text = '<no text provided>',
		text_light_blue = '',
		subtitle = '<no subtitle provided>',
		class: className
	}: Props = $props();
</script>

<article class={cn('flex flex-col items-start gap-3', className)}>
	<div>
		<prelude class="text-xl font-light text-sky-500">
			{prelude}
		</prelude>
		<div class="text-5xl font-light text-sky-500">
			{text_light_blue} <span class="text-sky-600">{text}</span>
		</div>
	</div>
	<p class="inter self-stretch text-sm font-normal leading-snug">
		{subtitle}
	</p>
</article>
