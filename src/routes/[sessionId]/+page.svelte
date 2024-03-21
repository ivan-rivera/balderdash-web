<script>
	import { page } from '$app/stores';
	import { syncSession } from '$lib/session';
	import { onMount } from 'svelte';
	import { SESSION_STATES } from '../../lib/types.js';
	import { sessionData, sessionState } from '$lib/store.js';
	import Lobby from '../../components/Lobby.svelte';
	import Summary from '../../components/Summary.svelte';
	import Game from '../../components/Game.svelte';
    import { applyAction } from '$app/forms';

	onMount(
		async () => {
            await syncSession($page.params.sessionId, (data) => {
				sessionData.set(data);
			})
            if ($sessionState === SESSION_STATES.UNKNOWN) {
                applyAction({type: 'error', error: { message: 'server error' }})
            }
        }
	);
	const stateToComponent = {
		[SESSION_STATES.INITIATED]: Lobby,
		[SESSION_STATES.STARTED]: Game,
		[SESSION_STATES.FINISHED]: Summary,
	};
</script>

<svelte:component this={stateToComponent[$sessionState]} />
