<!-- Section Two of landing page -->
<script lang="ts">
	import Activity from '$lib/components/public/widgets/dynamic/activity.svelte';
	import { AspectRatio } from '$lib/components/vendor/ui/aspect-ratio/index.js';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
</script>

<assembly class="flex flex-col lg:flex-row justify-between items-start gap-20">
	<div class="w-11/12">
		<HeroBlock
			no_signup
			activities_column_on_mobile
			text="Who are we?"
			subtitle="The Association for Computing Machinery (ACM) is the world's largest scientific and educational computing society. The University of Belize’s chapter of the ACM is only the second Student Chapter in Central America, and a part of the growing ACM network. The ACM offers members the opportunity to be an active part of the association by organizing activities such as technical talks, forums, field trips, and programming contests."
		>
			<preload class="hidden text-3xl" />
			<Activity size="text-3xl" data={{ title: 'Global members', number: '100,000+' }} />
			<Activity center size="text-3xl" data={{ title: 'Professional chapters', number: '180+' }} />
			<Activity center size="text-3xl" data={{ title: 'Student chapters', number: '680+' }} />
		</HeroBlock>
	</div>
	<AspectRatio ratio={16 / 9} class="bg-muted">
		<img
			src="/landing/stock/open-day-2019.png"
			alt="Gray by Drew Beamer"
			class="h-full w-full rounded-md object-cover"
		/>
	</AspectRatio>
</assembly>
