<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { session, round } from '$lib/store';
	import { ROUND_STATES } from '$lib/constants';
	import { toTitleCase } from '$lib/utils';
	import { config } from '$lib/config';
	import Selecting from './round/Selecting.svelte';
	import Guessing from './round/Guessing.svelte';
	import Marking from './round/Marking.svelte';
	import Voting from './round/Voting.svelte';
	import Revealing from './round/Revealing.svelte';
	import Tallying from './round/Tallying.svelte';

	const modalStore = getModalStore();
	const { players, limit } = session;
	const { dasher, number, state } = round;

	const stateToComponent = {
		[ROUND_STATES.SELECTING]: Selecting,
		[ROUND_STATES.GUESSING]: Guessing,
		[ROUND_STATES.MARKING]: Marking,
		[ROUND_STATES.VOTING]: Voting,
		[ROUND_STATES.REVEALING]: Revealing,
		[ROUND_STATES.TALLYING]: Tallying,
	};
	function removePlayer() {
		modalStore.trigger({ type: 'component', component: 'kick' });
	}

	let user = localStorage.getItem('username') || '';
	$: userIsDasher = $dasher == user;
</script>

<div>
	<h1 class="h1 text-center mb-5">Round {$number} of {$limit}</h1>
	<div class="flex justify-between items-center text-xs max-w-xs sm:max-w-lg mx-auto">
		{#each Object.keys(ROUND_STATES).filter((s) => s !== ROUND_STATES.UNKNOWN) as possibleState, index}
			<span class="hidden md:inline" class:highlighted={possibleState === $state}>
				{toTitleCase(possibleState)}
			</span>
			{#if index !== Object.keys(ROUND_STATES).length - 2}
				<span class="hidden md:inline text-secondary-500">&rsaquo;</span>
			{/if}
		{/each}
	</div>
	{#if state !== undefined}
		<h2 class="h2 text-center py-5">Stage: {toTitleCase($state)}</h2>
	{/if}
	<svelte:component this={stateToComponent[$state]} {userIsDasher} />
	<div class="flex flex-col items-center justify-center">
		<div class="role-chip py-1 px-2 my-5 rounded-lg">
			{$dasher}{userIsDasher ? ' (you)' : ''} is the dasher
		</div>
		<div class="italic text-sm mb-5">
			Playing as {user}
		</div>
		{#if $players.length > config.minPlayersRequired}
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
