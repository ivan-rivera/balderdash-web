<script>
	import { session } from '$lib/store'; 
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { sessionManagerStore } from '$lib/store';
	import Fa from 'svelte-fa';

	const modalStore = getModalStore();
	const { players } = session;

	let playerToRemove = $players[0];
	let username = localStorage.getItem('username') || '';
	async function kickPlayer() {
		// TODO: handle exceptions?
		await $sessionManagerStore.kick(username, playerToRemove);
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
			{#each $players as player}
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
