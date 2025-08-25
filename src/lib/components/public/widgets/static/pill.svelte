<!-- Pill component -->
<script lang="ts">
	interface Props {
		background?: string;
		text?: string;
	}

	let { background = '', text = '<No text provided>' }: Props = $props();
</script>

<component
	class="flex flex-col items-start gap-4 bg-cover rounded-lg w-full h-64 px-6 py-8"
	style="background-image: {background
		? `url(${background})`
		: ''}; background-repeat: no-repeat; background-color: lightgray;"
>
	<article class="text-3xl text-slate-50 font-extralight self-stretch flex-1">{text}</article>
</component>
