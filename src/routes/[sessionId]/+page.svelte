<script>
	import { page } from '$app/stores';
	import { syncSession } from '$lib/session';
	import { onMount } from 'svelte';
	import { SESSION_STATES } from '../../lib/types.js';
	import { sessionData, sessionState, sessionPlayers, kickedRegistry } from '$lib/store.js';
	import Lobby from '../../components/Lobby.svelte';
	import Summary from '../../components/Summary.svelte';
	import Game from '../../components/Game.svelte';
	import Outsider from '../../components/Outsider.svelte';
	import Kicked from '../../components/Kicked.svelte';
	import Empty from '../../components/Empty.svelte';

	let username = '';
	onMount(async () => {
		username = localStorage.getItem('username') || '';
		await syncSession($page.params.sessionId, (data) => sessionData.set(data));
	});

	$: playerIsInSession = $sessionPlayers.includes(username);
	$: playerWasKicked = Object.keys($kickedRegistry ?? {}).includes(username);
	$: playerState =
		$sessionState == SESSION_STATES.UNKNOWN
			? SESSION_STATES.UNKNOWN
			: playerIsInSession
				? $sessionState
				: playerWasKicked
					? 'KICKED'
					: 'OUTSIDER';

	const stateToComponent = {
		[SESSION_STATES.INITIATED]: Lobby,
		[SESSION_STATES.STARTED]: Game,
		[SESSION_STATES.FINISHED]: Summary,
		[SESSION_STATES.UNKNOWN]: Empty,
		OUTSIDER: Outsider,
		KICKED: Kicked, // TODO: tidy it up & test
	};
</script>

<svelte:component this={stateToComponent[playerState]} />
