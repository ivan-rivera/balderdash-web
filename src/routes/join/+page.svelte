<script>
	import { handleSessionJoinOutcome, joinSession } from '$lib/session';
	import EntryForm from '../../components/EntryForm.svelte';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let username = '';
	let sessionId = '';
	let submitHandler = async () => {
		const outcome = await joinSession(sessionId, username);
		handleSessionJoinOutcome(outcome, username, toastStore);
	};
</script>

<main>
	<h1 class="h1 text-center pb-10">Join Game</h1>
	<EntryForm onSubmit={submitHandler} bind:username>
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
	</EntryForm>
</main>
