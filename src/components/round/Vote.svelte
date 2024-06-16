<script>
	/**
	 * @typedef {Object.<string, {response: string, authors: string[], yours: boolean}>} GroupedGuesses
	 */
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import Prompter from '../parts/Prompter.svelte';
	import { CORRECT, DASHER, GUESSES, SCOREBOARD, SESSION, USERNAME, VOTES } from '$lib/constants';
	import { getCategoryWords } from '$lib/utils';
	import { session, round, sessionData } from '$lib/store';
	import { getContext } from 'svelte';
	import { faCircleExclamation, faDotCircle } from '@fortawesome/free-solid-svg-icons';
	import { shuffle } from '$lib/utils';
	import { TRUE_RESPONSE } from '$lib/constants';
	import Fa from 'svelte-fa';
	import { enhance } from '$app/forms';

	const { players, scoreboard } = session;
	const { dasher, guesses, votes, category, response: trueResponse } = round;
	let user = getContext(USERNAME);
	$: ({ prompt } = getCategoryWords($category));
	$: userIsDasher = $dasher == user;
	$: userHasVoted = user in $votes;
	const correctGuessers = Object.keys($guesses).filter((player) => $guesses[player].correct);
	const incorrectGuesses = Object.fromEntries(
		Object.entries($guesses).filter(([_, guess]) => !guess.correct),
	);
	const groupedGuesses = Object.keys(incorrectGuesses).reduce((acc, key) => {
		const { group, response, double } = incorrectGuesses[key];
		if (!acc[group]) acc[group] = { response, authors: [], yours: key === user };
		acc[group].authors.push(double ? `${key} (DB)` : key);
		return acc;
	}, /** @type {GroupedGuesses} */ ({}));
	groupedGuesses[TRUE_RESPONSE] = { response: $trueResponse, authors: [], yours: false };
	const shuffledGuesses = shuffle(Object.entries(groupedGuesses)).map(
		([group, content], index) => ({ group, content, index }),
	);
	let guessSpecs = Object.entries($guesses)
		.map(([user, guess]) => ({
			user,
			group: guess.group,
			double: guess.double,
		}))
		.reduce((acc, { user, group, double }) => {
			acc[user] = { group, double };
			return acc;
		}, /** @type {Object.<string, {group: string, double: boolean}>} */ ({}));
	let selectedResponse = shuffledGuesses.find(({ group }) => group === $votes[user])?.index ?? -1;
	let userWasCorrect = correctGuessers.includes(user);
	let doublesExist = Object.values(guessSpecs).some((g) => g.double);
	$: aisExist = $sessionData.ais > 0;
	$: selectedGroup = shuffledGuesses.find(({ index }) => index === selectedResponse);
	$: stillVoting = $players.filter(
		(player) => !(player in $votes) && player !== $dasher && !correctGuessers.includes(player),
	);
	$: swappedVotes = Object.entries($votes).reduce((acc, [player, group]) => {
		if (!acc[group]) acc[group] = [];
		acc[group].push(player === user ? `${player} (You)` : player);
		return acc;
	}, /** @type {Object.<string, string[]>} */ ({}));
</script>

<Prompter withInfo={false} />
<p class="text-center text-xs pt-5 italic">
	Voting results will become available after you cast your vote. Dasher and those with correct
	guesses in the previous stage are uneligible to vote and they will see voting results immediately
	so don't tell the others what you see!
</p>
{#if userIsDasher}
	<p class="text-center pt-5">Wait for guessers to vote</p>
{:else if userHasVoted}
	<p class="text-center pt-5">You have voted, wait for the others...</p>
{:else if userWasCorrect}
	<p class="text-center pt-5 font-bold">Your guess was correct! Wait for the others to vote...</p>
{:else}
	<p class="text-center pt-5">Guess the correct {prompt}</p>
{/if}
<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full">
	<span class="text-sm"><Fa icon={faCircleExclamation} /></span>
	<span class="text-xs">Every player will see responses in a different order!</span>
</span>
<form action="?/vote.cast" method="POST" use:enhance>
	<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
	<RadioGroup
		background=""
		border=""
		hover=""
		active="variant-ghost-secondary"
		rounded="rounded-container-token"
		flexDirection="flex-col w-full"
	>
		{#each shuffledGuesses as { group, content, index }}
			<RadioItem
				bind:group={selectedResponse}
				name="selection"
				value={index}
				required
				disabled={userIsDasher || userHasVoted || userWasCorrect || content.yours}
			>
				<div class="card my-5 border border-tertiary-500 w-full">
					{#if userIsDasher || userHasVoted || userWasCorrect}
						<div class="card-header text-xs underline">
							{group === TRUE_RESPONSE
								? `Correct ${prompt}`
								: `Author(s): ${content.authors.join(', ')}`}
						</div>
					{/if}
					<section class="py-10 mx-5 italic text-center">{content.response}</section>
					<footer class="card-footer">
						{#if userIsDasher || userHasVoted || userWasCorrect}
							<p>Voters: {swappedVotes[group] ? swappedVotes[group].join(', ') : 'No votes'}</p>
						{/if}
						{#if content.yours}
							<p class="underline">This is your submission</p>
						{/if}
					</footer>
				</div>
			</RadioItem>
		{/each}
	</RadioGroup>
	{#if !userIsDasher && !userHasVoted && !userWasCorrect}
		{#if selectedResponse < 0}
			<p class="text-center text-sm pb-2">Choose an option to vote for</p>
		{/if}
		<button
			class="btn variant-filled btn-lg rounded-lg w-full pt-5"
			type="submit"
			disabled={selectedResponse < 0}>Vote</button
		>
	{/if}
	<input type="text" name="selected-group" value={selectedGroup?.group ?? ''} hidden />
</form>
{#if userIsDasher && stillVoting.length === 0}
	<form action="?/vote.continue" method="POST">
		<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
		<input name={VOTES} value={JSON.stringify($votes)} type="text" hidden />
		<input name={GUESSES} value={JSON.stringify(guessSpecs)} type="text" hidden />
		<input name={CORRECT} value={JSON.stringify(correctGuessers)} type="text" hidden />
		<input name={SCOREBOARD} value={JSON.stringify($scoreboard)} type="text" hidden />
		<input name={DASHER} value={$dasher} type="text" hidden />
		<button class="btn variant-filled btn-lg rounded-lg w-full" type="submit">Continue</button>
	</form>
{/if}
{#if userIsDasher && stillVoting.length > 0}
	<p class="text-center pb-5">Wait for guessers to cast their votes...</p>
{/if}
{#if (aisExist || doublesExist) && (userIsDasher || userHasVoted || userWasCorrect)}
	<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full">
		<span class="text-sm"><Fa icon={faCircleExclamation} /></span>
		{#if doublesExist}
			<span class="text-xs text-primary-400">DB: </span>
			<span class="text-xs">Double Bluff </span>
		{/if}
		{#if aisExist}
			<span class="text-xs text-primary-400">NPC: </span>
			<span class="text-xs">Auto-generated</span>
		{/if}
	</span>
{/if}
{#if stillVoting.length > 0}
	<p class="text-lg pt-5">Still voting:</p>
	<ul>
		{#each stillVoting as user}
			<li>
				<span class="badge"><Fa icon={faDotCircle} /></span>
				<span class="flex-auto">{user}</span>
			</li>
		{/each}
	</ul>
{/if}
