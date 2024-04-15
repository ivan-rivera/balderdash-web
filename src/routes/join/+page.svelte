<script>
	/**
	 * * @typedef {import('firebase/database').Database} Database
	 */

	import { page } from '$app/stores';
	import { DB_MANAGER } from '$lib/constants';
	import { DatabaseError, handleError } from '$lib/errors';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getContext } from 'svelte';
	import Entry from '../../components/Entry.svelte';
	import { goto } from '$app/navigation';
	import DatabaseManager from '$lib/database';

	/** @type {DatabaseManager} */
	const db = getContext(DB_MANAGER);
	const toastStore = getToastStore();

	let username = '';
	let sessionId = $page.url.searchParams.get('id') || '';
	let submitHandler = async () => {
		await db
			.join(username, sessionId)
			.then(() => {
				localStorage.setItem('username', username);
				localStorage.setItem('sessionId', sessionId);
				goto(`/${sessionId}`);
			})
			.catch((error) => handleError(toastStore, new DatabaseError(error)));
	};
</script>

<main>
	<h1 class="h1 text-center pb-10">Join Game</h1>
	<Entry onSubmit={submitHandler} bind:username>
		<label class="label">
			<div class="font-bold small-gap">Session ID</div>
			<input
				class="input"
				title="sessionId"
				type="text"
				placeholder="ABCDE123"
				bind:value={sessionId}
				required
			/>
		</label>
		<br class="pb-5" />
	</Entry>
</main>
