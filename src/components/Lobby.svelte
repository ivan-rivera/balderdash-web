<script>
	import Fa from 'svelte-fa';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { faCircleExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
	import {
		sessionPlayers,
		sessionHost,
		sessionAiGuesses,
		roundLimit,
		sessionCategories,
	} from '$lib/store.js';
	import { config } from '$lib/config';
	import { getButtonVariant } from '$lib/utils';
	import { launchGame } from '$lib/session';
	import { GenericError } from '../lib/types.js';

	$: categories = $sessionCategories.join(', ');
	$: isButtonDisabled = $sessionPlayers.length < config.minPlayersRequired;
	$: buttonVariant = getButtonVariant(isButtonDisabled);
	const toastStore = getToastStore();
	let username = localStorage.getItem('username') ?? 'unknown';
	let sessionId = localStorage.getItem('sessionId') ?? 'unknown';
	let invitationText = 'Join me for a game of Balderdash!';
	let invitationUrl = `${config.url}/join?id=${sessionId}`;
	let invitationTextAndUrl = `${invitationText} URL: ${invitationUrl}`;

	/**
	 * Trigger an error toast
	 * @param {any} error
	 */
	function triggerError(error) {
		let errorMessage = /** @type {GenericError} */ (error).message ?? JSON.stringify(error);
		toastStore.trigger({
			message: errorMessage,
			timeout: config.errorTimeout,
			background: 'variant-filled-error',
		});
	}
	const invite = async () => {
		if (navigator === undefined) {
			triggerError(new GenericError('Navigator not available'));
		} else if (navigator.share) {
			try {
				await navigator.share({ title: 'Invitation', text: invitationTextAndUrl });
			} catch (error) {
				triggerError(error);
			}
		} else if (navigator.clipboard === undefined || navigator.clipboard.writeText === undefined) {
			triggerError(new GenericError('This functionality is not supported on your device'));
		} else {
			try {
				await navigator.clipboard.writeText(invitationTextAndUrl);
				toastStore.trigger({
					message: 'Invitation copied to clipboard!',
					timeout: config.errorTimeout,
					background: 'variant-filled-success',
				});
			} catch (error) {
				triggerError(error);
			}
		}
	};
</script>

<div class="text-center">
	<h1 class="h1 mb-5">Lobby</h1>
	<div class="border-2 border-surface-400 rounded-lg p-5">
		<h2 class="h2 mb-5">Players</h2>
		<div class="border-t-primary-400" />
		<ul>
			{#each $sessionPlayers as player}
				<li class="inline-flex gap-x-1 w-full items-center">
					<span class="text-xl text-success-800"><Fa icon={faCheckCircle} /></span>
					<span class="text-2xl">{player === username ? `${player} (you)` : player}</span>
				</li>
			{/each}
		</ul>
		<div class="border-2 border-surface-400 my-10" />
		<h2 class="h2 mb-5">Game Details</h2>
		<div class="text-left text-sm xs:text-lg">
			<div>
				<span class="session-detail">Session ID: </span>
				<span>{sessionId}</span>
			</div>
			<div>
				<span class="session-detail">Host: </span>
				<span>{$sessionHost}</span>
			</div>
			<div>
				<span class="session-detail">Rounds: </span>
				<span>{$roundLimit}</span>
			</div>
			<div>
				<span class="session-detail">AI guesses: </span>
				<span>{$sessionAiGuesses}</span>
			</div>
			<div>
				<span class="session-detail">Categories: </span>
				<span>{categories}</span>
			</div>
		</div>
	</div>
	{#if isButtonDisabled && username === $sessionHost}
		<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full mt-2">
			<span class="txt-lg"><Fa icon={faCircleExclamation} /></span>
			<span>At least {config.minPlayersRequired} are needed to begin</span>
		</span>
	{/if}
	<div class="mt-5">
		{#if username === $sessionHost}
			<button
				name="start-game"
				type="button"
				class="{buttonVariant} text-2xl button-xl rounded-lg w-full p-3 mb-2"
				disabled={isButtonDisabled}
				on:click={async () => await launchGame(sessionId)}
				>Launch
			</button>
		{:else}
			<p class="text-tertiary-700 pb-5">Waiting for host to start the game...</p>
		{/if}
		<button
			name="invite"
			type="button"
			class="btn bg-gradient-to-br variant-gradient-primary-tertiary text-2xl button-xl rounded-lg w-full p-3 mb-5"
			on:click={invite}
			>Invite
		</button>
	</div>
</div>

<style>
	.session-detail {
		@apply font-bold text-primary-400;
	}
</style>
