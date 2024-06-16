<script>
	import { goto } from '$app/navigation';
	function goHome() {
		goto('/');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<h1 class="font-['Mea_Culpa'] text-7xl text-center p-10 cursor-pointer" on:click={goHome}>
	<span class="accent-logo">B</span><span>alderdash</span><span class="accent-logo">!</span>
</h1>

<style>
	.accent-logo {
		@apply text-primary-500;
	}
</style>
