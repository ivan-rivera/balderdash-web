<script>
	import { goto } from '$app/navigation';
	import { getSessionFromDb } from '$lib/session';
	import { SESSION_STATES } from '$lib/types';
	import { onMount } from 'svelte';

	let activeSessionExists = false;
	let username = '';
	let sessionId = '';
	onMount(async () => {
		username = localStorage.getItem('username') || '';
		sessionId = localStorage.getItem('sessionId') || '';
		let isGameInProgress = sessionId !== '' && username !== '';
		if (isGameInProgress) {
			let sessionState = await getSessionFromDb(sessionId);
			activeSessionExists =
				(sessionState.state == SESSION_STATES.INITIATED ||
					sessionState.state == SESSION_STATES.STARTED) &&
				Object.keys(sessionState.scoreboard).includes(username);
			if (!activeSessionExists) {
				localStorage.clear();
			}
		}
	});
</script>

<div class="flex flex-col items-center justify-center mx-auto">
	<div class="py-5">
		<h2 class="h2 py-2 text-center">Balderdash • /ˈbɔːldədaʃ/</h2>
		<h3 class="h3">senseless talk or writing; nonsense</h3>
	</div>
	<div class="flex flex-col items-center justify-center space-y-5 p-10">
		<h1 class="h1">Menu</h1>
		<button
			name="start-game"
			type="button"
			class="variant-filled action-button"
			on:click={() => goto('/new')}>Start Game</button
		>
		<button
			name="new-game"
			type="button"
			class="variant-filled action-button"
			on:click={() => goto('/join')}>Join Game</button
		>
		{#if activeSessionExists}
			<button
				name="resume-game"
				type="button"
				class="variant-filled action-button"
				on:click={() => goto(`/${sessionId}`)}>Resume Game</button
			>
		{/if}
	</div>
	<p class="my-5">
		The iconic party game of bluffing and trivia! Guess or craft clever definitions for a mix of
		obscure words, people, and more! Perfect for 4-8 players seeking a fun, brain-teasing challenge!
	</p>
</div>

<style>
	.action-button {
		@apply btn-xl rounded-lg w-full;
	}
</style>
