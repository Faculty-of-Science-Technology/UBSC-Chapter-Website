<!-- Section Two of landing page -->
<script lang="ts">
	import Activity from '$lib/components/public/widgets/dynamic/activity.svelte';
	import { AspectRatio } from '$lib/components/vendor/ui/aspect-ratio/index.js';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';

	interface Props {
		statistics: {
			totalMembers: number;
			totalEvents: number;
			totalGroups: number;
			totalPosts: number;
			activeGroups: number;
		};
	}

	let { statistics }: Props = $props();
</script>

<assembly class="flex flex-col lg:flex-row justify-between items-start gap-20">
	<div class="w-11/12">
		<HeroBlock
			no_signup
			activities_column_on_mobile
			text="Who are we?"
			subtitle="The Association for Computing Machinery (ACM) is the world's largest scientific and educational computing society. The University of Belize's chapter of the ACM is only the second Student Chapter in Central America, and a part of the growing ACM network. The ACM offers members the opportunity to be an active part of the association by organizing activities such as technical talks, forums, field trips, and programming contests."
		>
			<preload class="hidden text-3xl"></preload>
			<Activity center size="text-3xl" data={{ title: 'Total Members', number: statistics.totalMembers.toLocaleString() }} />
			<Activity center size="text-3xl" data={{ title: 'Published Posts', number: statistics.totalPosts.toString() }} />
			<Activity center size="text-3xl" data={{ title: 'Events Hosted', number: statistics.totalEvents.toString() }} />
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
