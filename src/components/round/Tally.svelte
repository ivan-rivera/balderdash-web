<script>
	/**
	 * @typedef {import("$lib/types").Scoreboard} Scoreboard
	 */

	import { getContext } from 'svelte';
	import { SESSION, USERNAME } from '$lib/constants';
	import { round, sessionData } from '$lib/store';
	const { dasher, interruption } = round;
	import Score from '../parts/Score.svelte';

	let user = getContext(USERNAME);
	$: userIsDasher = $dasher == user;
</script>

{#if $interruption}
	<p class="text-center font-bold text-primary-500">
		This round was interrupted: {$interruption}
	</p>
{/if}
<Score />

{#if userIsDasher}
	<form action="?/tally.continue" method="POST">
		<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
		<button class="mt-5 btn variant-filled btn-lg rounded-lg w-full" type="submit">Continue</button>
	</form>
{:else}
	<p class="text-center pt-5">Wait for the dasher to continue</p>
{/if}
