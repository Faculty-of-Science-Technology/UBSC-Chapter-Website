<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import SectionOne from '$lib/templates/landing/sections/section-one.svelte';
	import SectionThree from '$lib/templates/landing/sections/section-three.svelte';
	import SectionTwo from '$lib/templates/landing/sections/section-two.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-80">
		<SectionOne statistics={data.statistics} />
		<SectionTwo statistics={data.statistics} />
		<SectionThree statistics={data.statistics} groups={data.groups} />
	</main>
	<Footer/>
</page>