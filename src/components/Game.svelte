<script>
	import { roundLimit, currentRound, currentRoundState, isDasher } from '$lib/store.js';
	import { GenericError, ROUND_STATES } from '$lib/types';
	import Selecting from './round/selecting/Selecting.svelte';
	import Guessing from './round/guessing/Guessing.svelte';
	import Marking from './round/marking/Marking.svelte';
	import Voting from './round/voting/Voting.svelte';
	import Revealing from './round/revealing/Revealing.svelte';
	import Tallying from './round/tallying/Tallying.svelte';
	import { onMount } from 'svelte';
    import { error } from '@sveltejs/kit';
	import { applyAction } from '$app/forms';

	/**
	 * Convert snake_case to TitleCase
	 * @param {string} str
	 */
	function toTitleCase(str) {
		return str
			.toLowerCase()
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

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
	$: role = $userIsDasher ? 'the dasher' : 'a guesser';

    onMount(() => {
		if ($userIsDasher) {
            applyAction({type: 'error', error: { message: 'server error' }})
        }
    })
</script>

<div>
	<h1 class="h1 text-center mb-5">Round {$currentRound} of {$roundLimit}</h1>
	<ol class="breadcrumb text-xs">
		{#each Object.keys(ROUND_STATES) as possibleState, index}
			<li class:highlighted={possibleState === $currentRoundState}>{toTitleCase(possibleState)}</li>
			{#if index !== Object.keys(ROUND_STATES).length - 1}
				<li class="text-secondary-500">→</li>
			{/if}
		{/each}
	</ol>
	<div class="flex items-center justify-center">
		<div class="role-chip py-1 px-2 my-5 rounded-lg">You ({username}) are {role}</div>
	</div>
	<h2 class="h2 text-center">{toTitleCase($currentRoundState)}</h2>
	<svelte:component this={stateToComponent[$currentRoundState]} userIsDasher={$userIsDasher} />
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
