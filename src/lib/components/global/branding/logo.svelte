<script lang="ts">
	interface Props {
		mode?: 'light' | 'dark';
		size?: 'sm' | 'md' | 'lg';
	}

	let { mode = 'light', size = 'sm' }: Props = $props();
</script>

<div class="nav-logo flex items-center gap-1">
	<img src="/landing/stock/acm_chapter_{mode}.png" alt="ACM Chapter Logo" width={size === 'sm' ? '40px' : size === 'md' ? '80px' : '120px'} />
	<div class="font-thin text-{size === 'sm' ? 'lg' : size === 'md' ? '2xl' : '3xl'} text-{mode === 'light' ? 'secondary' : 'muted'}">UBACM</div>
</div>
