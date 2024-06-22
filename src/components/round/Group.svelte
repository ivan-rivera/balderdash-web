<script>
	/**
	 * @typedef {import("$lib/types").Guess} Guess
	 */

	import Prompter from '../parts/Prompter.svelte';
	import { SESSION, USERNAME } from '$lib/constants';
	import { round, session } from '$lib/store';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';

	const { data } = session;
	const { dasher, guesses } = round;
	let user = getContext(USERNAME);
	$: userIsDasher = $dasher === user;
	const incorrectGuesses = Object.fromEntries(
		// eslint-disable-next-line no-unused-vars
		Object.entries(/** @type {Object.<string, Guess>} */ ($guesses)).filter(
			([_, guess]) => !guess.correct,
		),
	);
	const options = Object.entries(incorrectGuesses).map((_, index) => `Group ${index + 1}`);
	const defaultOptions = Object.entries(incorrectGuesses).reduce((acc, [user], index) => {
		acc[user] = options[index];
		return acc;
	}, /** @type {Object.<string, string>} */ ({}));
</script>

<Prompter withInfo={false} />
{#if !userIsDasher}
	<p class="text-center pt-5">The dasher is grouping responses...</p>
	<p class="text-center text-xs pt-2">
		If several submissions are alike, they will be merged into a one definition
	</p>
{/if}

{#if userIsDasher}
	<p class="pt-5 text-center">Group guesses that mean the same thing</p>
	<p class="text-xs text-center">
		Assigning multiple guesses into a single dropdown category will merge them
	</p>
	<form action="?/group.continue" method="POST" use:enhance>
		<input type="text" name={SESSION} value={JSON.stringify($data)} hidden />
		{#each Object.entries(incorrectGuesses) as [user, guess]}
			<div class="card my-5">
				<div class="card-header text-xs">User: {user}</div>
				<section class="p-5 italic text-center">{guess.response}</section>
				<label for={user} class="text-center pb-2 w-28 mx-auto">
					<select name={user} class="select" bind:value={defaultOptions[user]}>
						{#each options as option}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
			</div>
		{/each}
		<button class="btn variant-filled btn-lg rounded-lg w-full" type="submit">Submit</button>
	</form>
{/if}
