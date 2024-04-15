<script>
	/**
	 * @typedef {import('firebase/database').Database} Database
	 */
	import { page } from '$app/stores';
	import { config } from '$lib/config';
	import { ClientError, handleError } from '$lib/errors';
	import { sessionManagerStore } from '$lib/store';
	import { session } from '$lib/store';
	import { getButtonVariant } from '$lib/utils';
	import { faCheckCircle, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';

	const toastStore = getToastStore();
	const { players, host, limit, ais, categories } = session;

	$: isButtonDisabled = $players.length < config.minPlayersRequired;
	$: buttonVariant = getButtonVariant(isButtonDisabled);

	let sessionId = $page.params.sessionId;
	let username = localStorage.getItem('username') ?? 'unknown';
	let invitationText = 'Join me for a game of Balderdash!';
	let invitationUrl = `${config.url}/join?id=${sessionId}`;
	let invitationTextAndUrl = `${invitationText} URL: ${invitationUrl}`;
	const invite = async () => {
		if (navigator === undefined) {
			let error = new ClientError('Navigator not available');
			handleError(toastStore, error);
			throw error;
		} else if (navigator.share) {
			try {
				await navigator.share({ title: 'Invitation', text: invitationTextAndUrl });
			} catch (_error) {
				let error = /** @type {Error} */ (_error);
				handleError(toastStore, error);
				throw error;
			}
		} else if (navigator.clipboard === undefined || navigator.clipboard.writeText === undefined) {
			let error = new ClientError('This functionality is not supported on your device');
			handleError(toastStore, error);
			throw error;
		} else {
			try {
				await navigator.clipboard.writeText(invitationTextAndUrl);
				toastStore.trigger({
					message: 'Invitation copied to clipboard!',
					timeout: config.toastTimeout,
					background: 'variant-filled-success',
				});
			} catch (_error) {
				let error = /** @type {Error} */ (_error);
				handleError(toastStore, error);
				throw error;
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
			{#each $players as player}
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
				<span>{$host}</span>
			</div>
			<div>
				<span class="session-detail">Rounds: </span>
				<span>{$limit}</span>
			</div>
			<div>
				<span class="session-detail">AI guesses: </span>
				<span>{$ais}</span>
			</div>
			<div>
				<span class="session-detail">Categories: </span>
				<span>{$categories.join(', ')}</span>
			</div>
		</div>
	</div>
	{#if isButtonDisabled && username === $host}
		<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full mt-2">
			<span class="txt-lg"><Fa icon={faCircleExclamation} /></span>
			<span>At least {config.minPlayersRequired} are needed to begin</span>
		</span>
	{/if}
	<div class="mt-5">
		{#if username === $host}
			<button
				name="start-game"
				type="button"
				class="{buttonVariant} text-2xl button-xl rounded-lg w-full p-3 mb-2"
				disabled={isButtonDisabled}
				on:click={async () =>
					$sessionManagerStore.launch().catch((error) => handleError(toastStore, error))}
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
