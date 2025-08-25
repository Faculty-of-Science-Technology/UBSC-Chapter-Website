<script lang="ts">
	interface Props {
		text?: string;
		text_light_blue?: string;
		subtitle?: string;
	}

	let { text = '<no text provided>', text_light_blue = '', subtitle = '<no subtitle provided>' }: Props = $props();
</script>

<article class="flex flex-col items-start gap-3">
	<div class="font-light text-5xl text-sky-500">
		{text_light_blue} <span class="text-sky-600">{text}</span>
	</div>
	<p class="self-stretch inter text-sm font-normal leading-snug">
		{subtitle}
	</p>
</article>
