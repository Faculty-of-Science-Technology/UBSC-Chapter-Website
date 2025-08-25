<!-- Description: Hero block component -->
<script lang="ts">
	import HeroActivityBlock from '$lib/templates/landing/blocks/hero-activity-block.svelte';
	import HeroSignup from '$lib/templates/landing/widgets/hero-signup.svelte';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	
	interface Props {
		text_light_blue?: string;
		text?: string;
		subtitle?: string;
		no_signup?: boolean;
		activities_column_on_mobile?: boolean;
	}
	
	let {
		text_light_blue = '',
		text = '',
		subtitle = '',
		no_signup = false,
		activities_column_on_mobile = false
	}: Props = $props();
</script>

<assembly class="flex flex-col items-start self-stretch gap-8">
	<HeroText {text_light_blue} {text} {subtitle} />
	{#if !no_signup}
		<HeroSignup />
	{/if}
	<div class="w-full flex items-center justify-center">
		<HeroActivityBlock activities_column={activities_column_on_mobile}>
			<slot />
		</HeroActivityBlock>
	</div>
</assembly>
