<!-- Section One of landing page -->
<script lang="ts">
	import Activity from '$lib/components/public/widgets/dynamic/activity.svelte';
	import Pill from '$lib/components/public/widgets/static/pill.svelte';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import HeroPillBlock from '$lib/templates/landing/blocks/hero-pill-block.svelte';

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
			text_light_blue="Belize's"
			text="First ACM Chapter"
			subtitle="The University of Belize's Associate for Computer Machinery (ACM) Chapter (UBACM) at The University of Belize is dedicated to upskilling and informing Belizeans about Technology."
		>
			<Activity data={{ title: 'Active Members', number: statistics.totalMembers.toString() }} />
			<Activity data={{ title: 'Active Groups', number: statistics.activeGroups.toString() }} />
		</HeroBlock>
	</div>
	<HeroPillBlock>
		<Pill text="Join a Global Organization" background="/landing/pill/world-map.png" />
		<Pill text="Find Your Passion" background="/landing/pill/man-holding-laptop.jpg" />
	</HeroPillBlock>
</assembly>
