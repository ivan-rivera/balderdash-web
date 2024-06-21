<script>
	/**
	 * @typedef {import("$lib/types").Scoreboard} Scoreboard
	 */
	import { getContext, onMount } from 'svelte';
	import { session } from '$lib/store';
	const { scoreboard } = session;
	import { SESSION_ID, USERNAME } from '$lib/constants';
	import Score from '../parts/Score.svelte';
	import { Confetti } from 'svelte-confetti';
	import Fa from 'svelte-fa';
	import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
	import { enhance } from '$app/forms';
	import { handleInfo, returnHome } from '$lib/utils';
	import posthog from 'posthog-js';
	import { FEEDBACK } from '$lib/constants';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let user = getContext(USERNAME);
	let feedbackVoteProvided = true;
	let feedbackTextProvided = true;
	/** @type {string} */ let feedbackText = '';

	const positiveFeedback = () => {
		posthog.capture('feedback_vote', { type: 'positive' });
		feedbackVoteProvided = true;
		localStorage.setItem('feedback_vote', 'provided');
		handleInfo(toastStore, 'Thumbs up submitted!');
	};
	const negativeFeedback = () => {
		posthog.capture('feedback_vote', { type: 'negative' });
		feedbackVoteProvided = true;
		localStorage.setItem('feedback_vote', 'provided');
		handleInfo(toastStore, 'Thumbs down submitted!');
	};

	const submitFeedback = () => {
		posthog.capture('feedback_submitted');
		feedbackTextProvided = true;
		localStorage.setItem('feedback_text', 'provided');
		handleInfo(toastStore, 'Feedback submitted!');
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

	onMount(() => {
		feedbackVoteProvided = localStorage.getItem('feedback_vote') !== null;
		feedbackTextProvided = localStorage.getItem('feedback_text') !== null;
		posthog.capture('game_completed');
	});
</script>

{#if highestScores.length === 1}
	<h3 class="h3 text-center">The winner is {winner}!</h3>
{:else}
	<h3 class="h3 text-center">The winners are {winner}!</h3>
{/if}
<div class="flex justify-center items-center pt-5">
	<Confetti size={10} duration={5000} infinite={false} amount={100} />
</div>
<Score />
{#if !feedbackVoteProvided}
	<p class="text-lg text-center pt-5">Did you have fun?</p>
	<div class="flex justify-center items-center py-5 gap-x-1">
		<button type="button" class="btn btn-lg variant-filled-success" on:click={positiveFeedback}>
			<Fa icon={faThumbsUp} size="lg" />
		</button>
		<button type="button" class="btn btn-lg variant-filled-error" on:click={negativeFeedback}>
			<Fa icon={faThumbsDown} size="lg" />
		</button>
	</div>
{/if}
{#if !feedbackTextProvided}
	<p class="text-center pb-2">Do you have any feedback to help us improve?</p>
	<form method="POST" action="?/feedback" use:enhance on:submit={submitFeedback}>
		<textarea
			bind:value={feedbackText}
			class="textarea mb-5"
			name={FEEDBACK}
			rows="4"
			placeholder="It would have been nice if..."
		/>
		<button
			class="btn variant-filled btn-lg rounded-lg w-full"
			type="submit"
			disabled={feedbackText.length < 10}>Submit</button
		>
	</form>
{/if}
<div class="text-center">
	<button
		type="button"
		class="btn btn-sm variant-ringed my-10"
		on:click={() => returnHome(USERNAME, SESSION_ID)}>Return home</button
	>
</div>
