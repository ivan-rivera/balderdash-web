<script>
	import { goto } from '$app/navigation';
	import lightImage from '$lib/assets/not-your-session-light.svg';
	import darkImage from '$lib/assets/not-your-session-dark.svg';
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	onMount(() => posthog.capture('error', { type: 'outsider' }));
</script>

<div class="text-center">
	<h1 class="h1">Not Your Session</h1>
	<p class="py-5">You are not a member of this session</p>
	<div class="flex justify-center py-12">
		<img src={lightImage} alt="light-page-not-found" class="dark:hidden" />
		<img src={darkImage} alt="dark-page-not-found" class="hidden dark:block" />
	</div>
	<p class="italic">
		Tip: If you are sure this is a mistake, then please make sure you don't clear your browser
		during an active session. Also avoid using incognito mode.
	</p>
	<button type="button" class="btn btn-sm variant-ringed my-10" on:click={() => goto('/')}
		>Return home</button
	>
</div>
