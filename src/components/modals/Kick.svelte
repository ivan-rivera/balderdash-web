<script>
	import Fa from 'svelte-fa';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { sessionPlayers } from '$lib/store.js';
	import { removePlayer } from '$lib/session.js';
	const modalStore = getModalStore();
	let playerToRemove = $sessionPlayers[0];
	let sessionId = localStorage.getItem('sessionId') || '';
    let username = localStorage.getItem('username') || '';
	async function kickPlayer() {
		removePlayer(sessionId, username, playerToRemove);
		modalStore.close();
	}
</script>

<div class="balderdash-modal">
	<h2 class="h2">Remove Player</h2>
	<p class="">
		If a player leaves the game before it ends, you can remove them in order to be able to finish it
		without them. This dialog window allows you to remove any player including yourself. This will
		restart the round nullifying the current progress in this round and the player will not be able
		to return to the game.
	</p>
	<label class="label pt-5">
		<span class="text-lg">Player to remove</span>
		<select class="select" bind:value={playerToRemove}>
			{#each $sessionPlayers as player}
				<option value={player}>{player}</option>
			{/each}
		</select>
	</label>
	<div class="flex justify-center">
		<button
			class="btn btn-lg variant-filled-error my-2 rounded-lg"
			on:click|preventDefault={kickPlayer}
			>Remove player
		</button>
	</div>
	<span class="inline-flex gap-x-1 items-center justify-center w-full text-sm">
		<span><Fa icon={faCircleExclamation} /></span>
		<span>Warning: this action cannot be undone!</span>
	</span>
</div>
