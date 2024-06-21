<script>
	import config from '$lib/config';
	import { ROUND_STATES, USERNAME } from '$lib/constants';
	import { round, session } from '$lib/store';
	import { toTitleCase } from '$lib/utils';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import Guess from '../round/Guess.svelte';
	import Group from '../round/Group.svelte';
	import Mark from '../round/Mark.svelte';
	import Select from '../round/Select.svelte';
	import Tally from '../round/Tally.svelte';
	import Vote from '../round/Vote.svelte';

	const { players, limit } = session;
	const { dasher, number, state } = round;
	const modalStore = getModalStore();
	const user = getContext(USERNAME);
	const removePlayer = () => modalStore.trigger({ type: 'component', component: 'kick' });
	const stateToComponent = {
		[ROUND_STATES.SELECT]: Select,
		[ROUND_STATES.GUESS]: Guess,
		[ROUND_STATES.MARK]: Mark,
		[ROUND_STATES.GROUP]: Group,
		[ROUND_STATES.VOTE]: Vote,
		[ROUND_STATES.TALLY]: Tally,
	};
</script>

<div>
	<!-- Top -->
	<h1 class="h1 text-center mb-5">Round {$number} of {$limit}</h1>
	<div class="flex justify-between items-center text-xs max-w-xs sm:max-w-lg mx-auto">
		{#each Object.keys(ROUND_STATES).filter((s) => s !== ROUND_STATES.UNKNOWN && s !== ROUND_STATES.LOADING) as possibleState, index}
			<span class="hidden md:inline" class:highlighted={possibleState === $state}>
				{toTitleCase(possibleState)}
			</span>
			{#if index !== Object.keys(ROUND_STATES).length - 3}
				<span class="hidden md:inline text-secondary-500">&rsaquo;</span>
			{/if}
		{/each}
	</div>
	<!-- Content -->
	{#if state !== undefined}
		<h2 class="h2 text-center py-5">Stage: {toTitleCase($state)}</h2>
	{/if}
	<svelte:component this={stateToComponent[$state]} />
	<!-- Bottom -->
	<div class="flex flex-col items-center justify-center">
		<div class="role-chip py-1 px-2 my-5 rounded-lg">
			{$dasher}{$dasher == user ? ' (you)' : ''} is the dasher
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

<!-- eslint-disable -->
<style>
	.highlighted {
		@apply text-primary-400 font-bold;
	}
	.role-chip {
		@apply bg-surface-800 text-surface-50
        dark:bg-surface-50 dark:text-surface-800;
	}
</style>
