<script>
	/**
	 * @typedef {import("$lib/types").Session} Session
	 * @typedef {import("$lib/types").PlayerState} PlayerState
	 */

	import { page } from '$app/stores';
	import { DB, FIREBASE, PLAYER_STATES, SESSION_STATES, USERNAME } from '$lib/constants';
	import { sessionData } from '$lib/store';
	import { child, getDatabase, onValue, ref } from 'firebase/database';
	import { getContext, onMount, setContext } from 'svelte';
	import Empty from '../../components/states/Empty.svelte';
	import Game from '../../components/states/Game.svelte';
	import Kicked from '../../components/states/Kicked.svelte';
	import Loading from '../../components/states/Loading.svelte';
	import Lobby from '../../components/states/Lobby.svelte';
	import Outsider from '../../components/states/Outsider.svelte';
	import Summary from '../../components/states/Summary.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const sessionRef = child(ref(getDatabase(getContext(FIREBASE)), DB), $page.params.sessionId);
	sessionData.set(data.session);
	setContext(USERNAME, data.username);
	onMount(async () => {
		onValue(sessionRef, (snapshot) => {
			sessionData.set(snapshot.val());
		});
	});

	$: sessionState = $sessionData.state;
	$: playerState = resolvePlayerState($sessionData, data.username);

	/**
	 * Resolve player state
	 * @param {Session} session - session data
	 * @param {string} username - username
	 * @returns {PlayerState} - player state
	 */
	function resolvePlayerState(session, username) {
		const playerWasKicked = Object.keys(session?.kicked ?? {}).includes(username);
		const playerInSession = Object.keys(session?.scoreboard ?? {}).includes(username);
		return playerWasKicked
			? PLAYER_STATES.KICKED
			: !playerInSession
				? PLAYER_STATES.OUTSIDER
				: PLAYER_STATES.READY;
	}
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
