<script>
	/**
	 * @typedef {import("../../lib/types.js").Category} Category
	 */
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import {
		currentRound,
		currentRoundPrompt,
		currentRoundResponse,
		currentRoundCategory,
	} from '$lib/store';
	import { config } from '$lib/config';
	import { initiateRoundState, updateRoundPrompt, updateRoundTimer } from '$lib/session';
	import { getCategoryWords } from '$lib/utils';
	import { ROUND_STATES } from '$lib/types';

	const modalStore = getModalStore();

	export let userIsDasher = false;

	let sessionId = localStorage.getItem('sessionId') || '';
	$: ({ prompt, response } = getCategoryWords(/** @type {Category} */ ($currentRoundCategory)));
	let timer = config.timer.default;
	function addTime() {
		if (timer < config.timer.max) timer += config.timer.increment;
	}
	function subtractTime() {
		if (timer > config.timer.min) timer -= config.timer.increment;
	}
	async function acceptPrompt() {
		await updateRoundTimer(sessionId, $currentRound, timer);
		await initiateRoundState(sessionId, $currentRound, ROUND_STATES.GUESSING);
	}
	async function newPrompt() {
		await updateRoundPrompt(sessionId);
	}
	function customPrompt() {
		modalStore.trigger({ type: 'component', component: 'prompt' });
	}
</script>

<div class="text-center py-5">
	{#if userIsDasher}
		<p>Choose a challenging prompt to guess</p>
	{:else}
		<p>The dasher is choosing a prompt...</p>
	{/if}
</div>
<div class="border-2 box-color rounded-lg py-2 text-center">
	<h2 class="h2 py-2 text-primary-400">{$currentRoundPrompt}</h2>
	{#if userIsDasher}
		<h4 class="h4 italic pb-2 mx-2">{$currentRoundResponse}</h4>
	{/if}
	<span class="arranged small-gap text-xs">
		<span><Fa icon={faCircleExclamation} /></span>
		{#if userIsDasher}
			<span>As</span>
			<span class="text-primary-400">dasher</span>
			<span>only you can see the {response}</span>
		{:else}
			<span>Only </span>
			<span class="text-primary-400">dasher</span>
			<span>can see the {response}</span>
		{/if}
	</span>
	<div class="border border-x-0 border-b-0 box-color max-w-xs sm:max-w-sm mx-auto" />
	<div>
		<span class="arranged pt-4 pb-2">
			<span>Category: </span>
			<span class="text-primary-400">{$currentRoundCategory}</span>
		</span>
		{#if userIsDasher}
			<div class="py-2 px-3">
				<div class="w-full flex justify-center items-center gap-x-5">
					<span class="text-sm">Round Timer (secs)</span>
					<div class="flex items-center gap-x-1.5">
						<button type="button" class="timer-button text-lg" on:click={subtractTime}>—</button>
						<input
							class="p-0 w-6 bg-transparent border-0 text-center"
							type="text"
							bind:value={timer}
							disabled
						/>
						<button type="button" class="timer-button text-lg" on:click={addTime}>＋</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
{#if userIsDasher}
	<div class="flex gap-x-2">
		<button
			type="button"
			class="btn variant-filled selection-button"
			on:click|preventDefault={acceptPrompt}>Accept</button
		>
		<button
			type="button"
			class="btn variant-filled selection-button"
			on:click|preventDefault={newPrompt}>New</button
		>
		<button
			type="button"
			class="btn variant-filled selection-button"
			on:click|preventDefault={customPrompt}>Custom</button
		>
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
	.box-color {
		@apply border-surface-700 dark:border-surface-100;
	}
	.timer-button {
		@apply size-6 inline-flex justify-center items-center gap-x-2 text-sm rounded-md border border-surface-400 shadow-sm;
	}
	.arranged {
		@apply inline-flex gap-x-1 items-center justify-center w-full text-sm sm:text-base;
	}
	.selection-button {
		@apply btn-lg rounded-lg my-2 w-full;
	}
</style>
