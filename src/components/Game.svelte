<script>
	// TODO: add kick player logic
	import {
		roundLimit,
		currentRound,
		currentRoundState,
		isDasher,
		currentRoundDasher,
		sessionPlayers,
	} from '$lib/store.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { ROUND_STATES } from '$lib/types';
	import Selecting from './round/Selecting.svelte';
	import Guessing from './round/Guessing.svelte';
	import Marking from './round/Marking.svelte';
	import Voting from './round/Voting.svelte';
	import Revealing from './round/Revealing.svelte';
	import Tallying from './round/Tallying.svelte';
	import { toTitleCase } from '$lib/utils';
	import { config } from '$lib/config';

	const modalStore = getModalStore();

	const stateToComponent = {
		[ROUND_STATES.SELECTING]: Selecting,
		[ROUND_STATES.GUESSING]: Guessing,
		[ROUND_STATES.MARKING]: Marking,
		[ROUND_STATES.VOTING]: Voting,
		[ROUND_STATES.REVEALING]: Revealing,
		[ROUND_STATES.TALLYING]: Tallying,
	};

	const username = localStorage.getItem('username') || '';
	$: userIsDasher = isDasher(username);
	function removePlayer() {
		modalStore.trigger({ type: 'component', component: 'kick' });
	}
</script>

<div>
	<h1 class="h1 text-center mb-5">Round {$currentRound} of {$roundLimit}</h1>
	<div class="flex justify-between items-center text-xs max-w-xs sm:max-w-lg mx-auto">
		{#each Object.keys(ROUND_STATES).filter((s) => s !== ROUND_STATES.UNKNOWN) as possibleState, index}
			<span class="hidden md:inline" class:highlighted={possibleState === $currentRoundState}>
				{toTitleCase(possibleState)}
			</span>
			{#if index !== Object.keys(ROUND_STATES).length - 2}
				<span class="hidden md:inline text-secondary-500">&rsaquo;</span>
			{/if}
		{/each}
	</div>
	<h2 class="h2 text-center py-5">Stage: {toTitleCase($currentRoundState)}</h2>
	<svelte:component this={stateToComponent[$currentRoundState]} userIsDasher={$userIsDasher} />
	<div class="flex flex-col items-center justify-center">
		<div class="role-chip py-1 px-2 my-5 rounded-lg">
			Player {$currentRoundDasher}{$userIsDasher ? ' (you)' : ''} is the dasher
		</div>
		{#if $sessionPlayers.length > config.minPlayersRequired}
			<button class="btn btn-sm variant-ringed mb-5" type="button" on:click={removePlayer}>
				Remove player
			</button>
		{/if}
	</div>
</div>

<style>
	.highlighted {
		@apply text-primary-400 font-bold;
	}
	.role-chip {
		@apply bg-surface-800 text-surface-50
        dark:bg-surface-50 dark:text-surface-800;
	}
</style>
