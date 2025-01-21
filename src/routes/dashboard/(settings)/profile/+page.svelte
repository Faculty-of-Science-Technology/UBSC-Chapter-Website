<!-- STUB -->
<script lang="ts">
	import DashboardPage from '../settings/+page.svelte';
	import { type PageData } from './$types';
    const { data: props } = $props();
	const data: PageData = props;
</script>

<DashboardPage {data} />
