<script>
	import { page } from '$app/stores';
	import Entry from '../../components/forms/Entry.svelte';

	let username = '';
	let sessionId = $page.url.searchParams.get('id') || '';
</script>

<main>
	<h1 class="h1 text-center pb-10">Join Game</h1>
	<Entry bind:username>
		<label class="label">
			<div class="font-bold small-gap">Session ID</div>
			<input
				class="input"
				title="sessionId"
				name="sessionId"
				type="text"
				placeholder="ABCDE123"
				bind:value={sessionId}
				required
			/>
		</label>
		<br class="pb-5" />
	</Entry>
</main>
