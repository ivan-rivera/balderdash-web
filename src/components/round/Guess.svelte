<script>
	/**
	 * @typedef {import('@fortawesome/free-solid-svg-icons').IconDefinition} IconDefinition
	 * @typedef {Object.<string, {icon: IconDefinition, color: string, label: string}>} PlayerInfo
	 */
	import config from '$lib/config';
	import { DOUBLE_BLUFF, GUESS, SESSION, USERNAME } from '$lib/constants';
	import { session, round, sessionData } from '$lib/store';
	import { getButtonVariant } from '$lib/utils';
	import {
		faCheckCircle,
		faXmark,
		faCircleExclamation,
		faHourglassHalf,
	} from '@fortawesome/free-solid-svg-icons';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { getContext, onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Prompter from '../parts/Prompter.svelte';
	import { getCategoryWords } from '$lib/utils';

	const { players } = session;
	const { dasher, guesses, time, category } = round;
	$: ({ prompt, response } = getCategoryWords($category));
	const user = getContext(USERNAME);
	let seconds = Math.round(($time - new Date().getTime()) / 1000);
	let guess = '';
	let /** @type {HTMLFormElement} */ form;
	let doubleBluff = false;
	$: submitButtonIsDisabled = guess.length < config.customPrompt.minResponseLength;
	$: buttonVariant = getButtonVariant(submitButtonIsDisabled);
	$: isDasher = $dasher === user;
	$: submittedGuess = $guesses[user]?.response ?? '';
	$: guessing = $players.length - Object.keys($guesses).length - 1;
	$: guessers = $players
		.filter((player) => player !== $dasher)
		.reduce((acc, player) => {
			const guessed = player in $guesses;
			acc[player] = {
				icon: guessed ? faCheckCircle : seconds > 0 ? faHourglassHalf : faXmark,
				color: guessed ? 'text-success-800' : seconds > 0 ? 'text-warning-800' : 'text-error-800',
				label: player === user ? `${player} (you)` : player,
			};
			return acc;
		}, /** @type {PlayerInfo} */ ({}));
	$: submitted = Object.keys($guesses).includes(user);
	$: message = isDasher
		? 'Wait for guesser submissions...'
		: `Guess the ${response} of the below ${prompt}`;
	onMount(() => setInterval(() => seconds--, 1000));
</script>

<p class="text-lg text-center pb-5">{message}</p>
<Prompter withInfo={true} />
<form
	bind:this={form}
	class="text-center py-2 px-5"
	id="guessing"
	method="POST"
	action="?/guess.submit"
>
	<input type="text" name="session" value={JSON.stringify($sessionData)} hidden />
	<!-- Input area -->
	{#if !isDasher && submitted}
		<p class="font-bold py-2">Guess submitted</p>
		<p class="italic">Your guess: "{submittedGuess}"</p>
	{/if}
	{#if !isDasher && seconds > 0 && !submitted}
		<textarea
			bind:value={guess}
			class="textarea mt-5 mb-5"
			name={GUESS}
			id="guess"
			rows="3"
			placeholder="Your guess..."
			minlength={config.customPrompt.minResponseLength}
			maxlength={config.customPrompt.maxResponseLength}
			required
		/>
		<br />
		<SlideToggle
			size="sm"
			name={DOUBLE_BLUFF}
			class="text-lg"
			active="bg-primary-500"
			bind:checked={doubleBluff}>Double Bluff Toggle</SlideToggle
		>
		<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full">
			<span class="txt-lg"><Fa icon={faCircleExclamation} /></span>
			<span>See the rules for Double Bluff info</span>
		</span>
		<button
			disabled={submitButtonIsDisabled}
			type="submit"
			class="btn btn-lg {buttonVariant} my-5 rounded-lg w-full">Submit</button
		>
	{:else}
		<!-- Dasher view -->
		<div class="border border-surface-400 my-2" />
		<p class="text-lg">Player status</p>
		<ul>
			{#each Object.entries(guessers) as [_player, info]}
				<li class="inline-flex gap-x-2 w-full items-center">
					<span class="text-xl {info.color}"><Fa icon={info.icon} /></span>
					<span class="text-2xl"> {info.label}</span>
				</li>
			{/each}
		</ul>
	{/if}
</form>
<div class="text-lg text-center pt-5">
	<!-- Timer -->
	{#if seconds > 0 && guessing > 0}
		<span>Time remaining: </span>
		<span class="font-bold">{seconds} seconds</span>
		{#if !isDasher}
			<p class="text-xs py-2 text-primary-400">
				If you fail to submit a definition in time, one will be submitted for you automatically, but
				you will not be able to gain any points for it!
			</p>
		{/if}
	{:else if guessing === 0}
		<p class="font-bold">All guesses submitted!</p>
		<p>Wait for the dasher to continue</p>
	{:else}
		<p class="font-bold">Time is up!</p>
	{/if}
	{#if isDasher && (guessing === 0 || seconds <= 0)}
		<form method="POST" action="?/guess.continue">
			<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
			<button type="submit" class="btn variant-filled btn-lg my-5 rounded-lg w-full"
				>Continue</button
			>
		</form>
	{/if}
</div>
