<script>
	/**
	 * @typedef {import('firebase/database').Database} Database
	 * @typedef {import("$lib/types").Session} Session
	 */
	import { page } from '$app/stores';
	import { DB_MANAGER, PLAYER_STATES, SESSION_STATES } from '$lib/constants';
	import { SessionManager } from '$lib/session';
	import { sessionManagerStore, session } from '$lib/store';
	import { getContext, onMount } from 'svelte';
	import Empty from '../../components/Empty.svelte';
	import Game from '../../components/Game.svelte';
	import Kicked from '../../components/Kicked.svelte';
	import Loading from '../../components/Loading.svelte';
	import Lobby from '../../components/Lobby.svelte';
	import Outsider from '../../components/Outsider.svelte';
	import Summary from '../../components/Summary.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	sessionManagerStore.set(
		new SessionManager(data.session, $page.params.sessionId, getContext(DB_MANAGER)),
	);

	const { kicked, players, state } = session;

	let username = '';
	let playerState = PLAYER_STATES.LOADING;
	let sessionState = SESSION_STATES.LOADING;
	let loaded = false;

	onMount(async () => {
		await $sessionManagerStore.sync(sessionManagerStore.set);
		username = localStorage.getItem('username') || '';
		loaded = true;
	});

	$: playerInSession = $players.includes(username);
	$: playerWasKicked = Object.keys($kicked ?? {}).includes(username);
	$: playerState = !loaded
		? PLAYER_STATES.LOADING
		: playerWasKicked
			? PLAYER_STATES.KICKED
			: !playerInSession
				? PLAYER_STATES.OUTSIDER
				: PLAYER_STATES.READY;
	$: sessionState = !loaded ? SESSION_STATES.LOADING : $state;
</script>

{#if playerState == PLAYER_STATES.LOADING || sessionState == SESSION_STATES.LOADING}
	<Loading />
{:else if playerState == PLAYER_STATES.KICKED}
	<Kicked />
{:else if playerState == PLAYER_STATES.OUTSIDER}
	<Outsider />
{:else if sessionState == SESSION_STATES.INITIATED}
	<Lobby />
{:else if sessionState == SESSION_STATES.STARTED}
	<Game />
{:else if sessionState == SESSION_STATES.FINISHED}
	<Summary />
{:else}
	<Empty />
{/if}
