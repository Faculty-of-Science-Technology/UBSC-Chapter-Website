<!-- STUB -->
<script lang="ts">
	import DashboardPage from '../settings/+page.svelte';
	import { type PageData } from './$types';
	const { data: props } = $props();
	const data: PageData = props;
</script>

<!-- This is a good example of how to pass data from a parent page to a child page. -->
<!-- As this is essentially just mirroring the data from the parent page. -->
<DashboardPage {data} />
