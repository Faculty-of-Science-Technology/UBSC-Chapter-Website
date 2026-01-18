<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';

	interface Props {
		prelude?: string;
		text?: string;
		text_light_blue?: string;
		subtitle?: string;
		class?: string;
		size_prelude?: string;
		size_text?: string;
		center?: boolean;
	}

	let {
		prelude = '<no prelude provided>',
		text = '<no text provided>',
		text_light_blue = '',
		subtitle = '<no subtitle provided>',
		class: className,
		size_prelude = undefined,
		size_text = undefined,
		center = false
	}: Props = $props();
</script>

<article class={cn(`flex flex-col ${center ? "items-center" : "items-start"} gap-3`, className)}>
	<div>
		<prelude class={`${size_prelude ?? "text-xl"} font-light text-sky-500`}>
			{prelude}
		</prelude>
		<div class={`${size_text ?? "text-5xl"} font-light text-sky-500`}>
			{text_light_blue} <span class="text-primary">{text}</span>
		</div>
	</div>
	<p class="inter text-sm font-normal leading-snug">
		{subtitle}
	</p>
</article>
