<script>
	import { goto } from '$app/navigation';
	import { session } from '$lib/store';
	import lightImage from '$lib/assets/not-your-session-light.svg';
	import darkImage from '$lib/assets/not-your-session-dark.svg';

	const { kicked } = session;
	let username = localStorage.getItem('username') || '';
	$: kicker = $kicked[username] ?? '';
	function returnHome() {
		localStorage.clear();
		goto('/');
	}
</script>

<div class="text-center">
	<h1 class="h1 pb-5">Kicked</h1>
	<div class="pb-5">
		<span>You've been removed from this session by</span>
		<span class="text-primary-400">{kicker}</span>
	</div>
	<div class="flex justify-center py-12">
		<img src={lightImage} alt="light-page-not-found" class="dark:hidden" />
		<img src={darkImage} alt="dark-page-not-found" class="hidden dark:block" />
	</div>
	<p>
		You cannot rejoin the session anymore. Note that the removal mechanism allows players to remove
		a member of their session that has become inactive and without whom the game cannot proceed
	</p>
	<button type="button" class="btn btn-sm variant-ringed my-10" on:click={returnHome}
		>Return home</button
	>
</div>
