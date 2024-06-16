<script>
	/**
	 * @typedef {import("$lib/types").Scoreboard} Scoreboard
	 */
	import { getContext } from 'svelte';
	import { session } from '$lib/store';
	const { scoreboard } = session;
	import { SESSION_ID, USERNAME } from '$lib/constants';
	import Score from '../parts/Score.svelte';
	import { Confetti } from 'svelte-confetti';
	import Fa from 'svelte-fa';
	import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
	import { enhance } from '$app/forms';
	import { returnHome } from '$lib/utils';

	let user = getContext(USERNAME);
	/** @type {string} */ let feedbackText = '';

	const positiveFeedback = () => {
		console.log('Positive feedback');
	};
	const negativeFeedback = () => {
		console.log('Negative feedback');
	};
	const freeFormFeedback = () => {
		console.log('Free form feedback');
	};

	/**
	 * Get the highest scorers
	 * @param {Scoreboard} scores
	 */
	function getHighestScorers(scores) {
		let highestScore = -Infinity;
		/** @type {string[]} */ let highestScorers = [];
		for (const [username, score] of Object.entries(scores)) {
			if (score > highestScore) {
				highestScore = score;
				highestScorers = [username];
			} else if (score === highestScore) {
				highestScorers.push(username);
			}
		}
		return highestScorers;
	}
	const highestScores = getHighestScorers($scoreboard).map((player) =>
		player === user ? `${player} (You)` : player,
	);
	const winner = highestScores.length === 1 ? highestScores[0] : highestScores.join(', ');
</script>

{#if highestScores.length === 1}
	<h3 class="h3 text-center">The winner is {winner}!</h3>
{:else}
	<h3 class="h3 text-center">The winners are {winner}!</h3>
{/if}
<div class="flex justify-center items-center">
	<Confetti size={10} duration={5000} infinite={false} amount={100} />
</div>
<Score />
<p class="text-lg text-center pt-5">Did you have fun?</p>
<div class="flex justify-center items-center py-5 gap-x-1">
	<button type="button" class="btn btn-lg variant-filled-success" on:click={positiveFeedback}>
		<Fa icon={faThumbsUp} size="lg" />
	</button>
	<button type="button" class="btn btn-lg variant-filled-error" on:click={negativeFeedback}>
		<Fa icon={faThumbsDown} size="lg" />
	</button>
</div>
<p class="text-center pb-2">Do you have any feedback to help us improve?</p>
<form use:enhance>
	<textarea
		bind:value={feedbackText}
		class="textarea mb-5"
		name="feedback"
		rows="4"
		placeholder="It would have been nice if..."
	/>
	<button
		class="btn variant-filled btn-lg rounded-lg w-full"
		type="submit"
		disabled={feedbackText.length < 10}
		on:click|preventDefault={freeFormFeedback}>Submit</button
	>
</form>
<div class="text-center">
	<button type="button" class="btn btn-sm variant-ringed my-10" on:click={() => returnHome(USERNAME, SESSION_ID)}
		>Return home</button
	>
</div>
