<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import lightImage from '$lib/assets/error-light.svg';
	import darkImage from '$lib/assets/error-dark.svg';
	$: errorMessage = ($page.error || { message: 'Something went wrong' }).message;
</script>

<div class="text-center">
	<h1 class="h1">Error</h1>
	<p class="py-5">Message: {errorMessage}</p>
	<div class="flex justify-center py-12">
		<img src={lightImage} alt="light-page-not-found" class="dark:hidden" />
		<img src={darkImage} alt="dark-page-not-found" class="hidden dark:block" />
	</div>
	<button type="button" class="btn btn-sm variant-ringed my-10" on:click={() => goto('/')}
		>Return home</button
	>
</div>
