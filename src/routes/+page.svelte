<script>
	import { goto } from '$app/navigation';
	import { DB_MANAGER } from '$lib/constants';
	import DatabaseManager from '$lib/database';
	import { getContext, onMount } from 'svelte';

	/** @type {DatabaseManager} */
	const db = getContext(DB_MANAGER);
	let sessionId = '';
	let username = '';

	onMount(async () => {
		sessionId = localStorage.getItem('sessionId') || '';
		username = localStorage.getItem('username') || '';
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
		{#await db.activeSessionExists(username, sessionId) then sessionExists}
			{#if sessionExists}
				<button
					name="resume-game"
					type="button"
					class="variant-filled action-button"
					on:click={() => goto(`/${sessionId}`)}>Resume Game</button
				>
			{/if}
		{/await}
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
