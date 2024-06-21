<script>
	/**
	 * @typedef {import("$lib/types").Category} Category
	 */

	import { getModalStore } from '@skeletonlabs/skeleton';
	import { round, sessionData } from '$lib/store';
	import config from '$lib/config';
	import { getCategoryWords } from '$lib/utils';
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { PROMPT, RESPONSE, SESSION, TIMER, USERNAME } from '$lib/constants';
	import Prompter from '../parts/Prompter.svelte';

	const modalStore = getModalStore();
	const { dasher, category, prompt: roundPrompt, response: roundResponse } = round;

	let user = getContext(USERNAME);
	$: userIsDasher = $dasher === user;
	$: ({ prompt } = getCategoryWords($category));
	let timer = config.timer.default;
	const customPrompt = () => modalStore.trigger({ type: 'component', component: 'prompt' });
	const timeControl = {
		add: () => timer < config.timer.max && (timer += config.timer.increment),
		subtract: () => timer > config.timer.min && (timer -= config.timer.increment),
	};
</script>

<div class="text-center py-5">
	{#if userIsDasher}
		<p>Choose a challenging {prompt} to guess</p>
	{:else}
		<p>The dasher is choosing a {prompt}...</p>
	{/if}
</div>
<!-- Selection Box -->
<Prompter withInfo={true} />
{#if userIsDasher}
	<div class="py-2 px-3">
		<div class="w-full flex justify-center items-center gap-x-5">
			<span class="text-sm">Round Timer (secs)</span>
			<div class="flex items-center gap-x-1.5">
				<button type="button" class="timer-button text-lg" on:click={timeControl.subtract}>—</button
				>
				<input
					class="p-0 w-6 bg-transparent border-0 text-center"
					type="text"
					name={TIMER}
					bind:value={timer}
					disabled
				/>
				<button type="button" class="timer-button text-lg" on:click={timeControl.add}>＋</button>
			</div>
		</div>
	</div>
{/if}
<!-- Controls -->
{#if userIsDasher}
	<div class="flex gap-x-2 justify-center">
		<form class="button-array" action="?/select.prompt.accept" method="POST" use:enhance>
			<input type="text" name={TIMER} bind:value={timer} hidden />
			<input type="text" name={PROMPT} value={$roundPrompt} hidden />
			<input type="text" name={RESPONSE} value={$roundResponse} hidden />
			<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
			<button type="submit" class="btn variant-filled selection-button">Accept</button>
		</form>
		<form class="button-array" action="?/select.prompt.randomize" method="POST" use:enhance>
			<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
			<button type="submit" class="btn variant-filled selection-button">New</button>
		</form>
		<div class="button-array">
			<button
				type="button"
				class="btn variant-filled selection-button"
				on:click|preventDefault={customPrompt}>Custom</button
			>
		</div>
	</div>
	<div>
		<span>As </span>
		<span class="text-primary-400">dasher</span>
		<span>you must either </span>
		<span class="text-primary-400">accept</span>
		<span> the current {prompt}, generate a </span>
		<span class="text-primary-400">new</span>
		<span> random {prompt} or enter your own </span>
		<span class="text-primary-400">custom</span>
		<span> {prompt} before proceeding. You may also want to set the </span>
		<span class="text-primary-400">timer</span>
		<span>that will determine how much time the guessers will be given</span>
	</div>
{/if}

<style>
	.timer-button {
		@apply size-6 inline-flex justify-center items-center gap-x-2 text-sm rounded-md border border-surface-400 shadow-sm;
	}
	.selection-button {
		@apply btn-lg rounded-lg my-2 w-full;
	}
	.button-array {
		@apply flex-grow flex-shrink;
	}
</style>
