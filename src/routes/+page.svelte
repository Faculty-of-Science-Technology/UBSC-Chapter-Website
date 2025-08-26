<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import SectionFour from '$lib/templates/landing/sections/section-four.svelte';
	import SectionOne from '$lib/templates/landing/sections/section-one.svelte';
	import SectionThree from '$lib/templates/landing/sections/section-three.svelte';
	import SectionTwo from '$lib/templates/landing/sections/section-two.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>UBACMSC &mdash; UB ACM Student Chapter</title>
	<meta
		name="description"
		content="The University of Belize's Associate for Computer Machinery (ACM) Chapter (UBACM) at The University of Belize is dedicated to upskilling and informing Belizeans about Technology."
	/>
</svelte:head>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-60">
		<SectionOne statistics={data.statistics} />
		<SectionTwo statistics={data.statistics} />
		<SectionThree statistics={data.statistics} groups={data.groups} />
		<SectionFour statistics={data.statistics} recentPosts={data.recentPosts} />
	</main>
	<Footer/>
</page>