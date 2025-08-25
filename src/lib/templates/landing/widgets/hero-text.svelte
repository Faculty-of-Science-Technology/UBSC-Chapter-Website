<script lang="ts">
	interface Props {
		prelude?: string;
		text?: string;
		text_light_blue?: string;
		subtitle?: string;
	}

	let { prelude = '<no prelude provided>', text = '<no text provided>', text_light_blue = '', subtitle = '<no subtitle provided>' }: Props = $props();
</script>

<article class="flex flex-col items-start gap-3">
	<div>
		<prelude class="font-light text-xl text-sky-500">
			{prelude}
		</prelude>
		<div class="font-light text-5xl text-sky-500">
			{text_light_blue} <span class="text-sky-600">{text}</span>
		</div>
	</div>
	<p class="self-stretch inter text-sm font-normal leading-snug">
		{subtitle}
	</p>
</article>
