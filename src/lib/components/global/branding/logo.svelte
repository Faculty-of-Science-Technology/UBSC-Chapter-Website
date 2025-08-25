<script lang="ts">
	interface Props {
		mode?: 'light' | 'dark';
	}

	let { mode = 'light' }: Props = $props();
</script>

<div class="nav-logo flex items-center gap-1">
	<img src="/landing/stock/acm_chapter_{mode}.png" alt="ACM Chapter Logo" width="40px" />
	<div class="font-thin text-lg">UBACM</div>
</div>
