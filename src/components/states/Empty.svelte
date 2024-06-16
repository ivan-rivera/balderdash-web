<script>
	import { goto } from '$app/navigation';
	import lightImage from '$lib/assets/404-light.svg';
	import darkImage from '$lib/assets/404-dark.svg';
</script>

<div class="text-center">
	<h1 class="h1 pb-10">No Such Session</h1>
	<p>The session you want to join doesn't exist!</p>
	<div class="flex justify-center py-12">
		<img src={lightImage} alt="light-page-not-found" class="dark:hidden" />
		<img src={darkImage} alt="dark-page-not-found" class="hidden dark:block" />
	</div>
	<button type="button" class="btn btn-sm variant-ringed my-10" on:click={() => goto('/')}
		>Return home</button
	>
</div>
