<script>
	import { enhance } from '$app/forms';
	import { KICKED, SESSION } from '$lib/constants';
	import { session } from '$lib/store';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import posthog from 'posthog-js';

	const modalStore = getModalStore();
	const { players, data } = session;
	let playerToRemove = $players[0];
</script>

<div class="balderdash-modal">
	<h2 class="h2">Remove Player</h2>
	<p>
		If a player leaves the game before it ends, you can remove them in order to be able to finish it
		without them. This dialog window allows you to remove any player including yourself. This will
		restart the round nullifying the current progress in this round and the player will not be able
		to return to the game.
	</p>
	<form
		action="?/global.kick"
		method="POST"
		use:enhance
		on:submit={() => {
			posthog.capture('player_kicked');
			modalStore.close();
		}}
	>
		<input type="text" name={SESSION} value={JSON.stringify($data)} hidden />
		<label class="label pt-5">
			<span class="text-lg">Player to remove</span>
			<select class="select" name={KICKED} bind:value={playerToRemove}>
				{#each $players as player}
					<option value={player}>{player}</option>
				{/each}
			</select>
		</label>
		<div class="flex justify-center">
			<button type="submit" class="btn btn-lg variant-filled-error my-2 rounded-lg"
				>Remove player
			</button>
		</div>
	</form>
	<span class="inline-flex gap-x-1 items-center justify-center w-full text-sm">
		<span><Fa icon={faCircleExclamation} /></span>
		<span>Warning: this action cannot be undone!</span>
	</span>
</div>
