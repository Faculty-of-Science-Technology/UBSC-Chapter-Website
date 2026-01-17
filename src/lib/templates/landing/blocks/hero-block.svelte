<!-- Description: Hero block component -->
<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import HeroActivityBlock from '$lib/templates/landing/blocks/hero-activity-block.svelte';
	import HeroSignup from '$lib/templates/landing/widgets/hero-signup.svelte';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	
	interface Props {
		prelude?: string;
		text_light_blue?: string;
		text?: string;
		subtitle?: string;
		no_signup?: boolean;
		activities_column_on_mobile?: boolean;
		class?: string;
		size_prelude?: string;
		size_text?: string;
		center?: boolean;
	}
	
	let {
		class: className,
		prelude = '',
		text_light_blue = '',
		text = '',
		subtitle = '',
		no_signup = false,
		activities_column_on_mobile = false,
		size_prelude = "xl",
		size_text = "5xl",
		center = false
	}: Props = $props();
</script>

<assembly class={cn(`flex flex-col items-${center? "center" : "start"} self-stretch gap-8`, className)}>
	<HeroText {prelude} {text_light_blue} {text} {subtitle} {size_prelude} {size_text} {center}/>
	{#if !no_signup}
		<HeroSignup />
	{/if}
	<div class="w-full flex items-center justify-center">
		<HeroActivityBlock activities_column={activities_column_on_mobile}>
			<slot />
		</HeroActivityBlock>
	</div>
</assembly>
