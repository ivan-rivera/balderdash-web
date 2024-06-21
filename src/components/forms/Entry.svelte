<script>
	import config from '$lib/config';
	import { getButtonVariant, handleError } from '$lib/utils';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]{0,11}$/;
	export let submitButtonEnabled = true;
	export let username = '';
	$: isValidUsername = usernameRegex.test(username);
	$: isButtonDisabled = !isValidUsername || !submitButtonEnabled;
	$: buttonVariant = getButtonVariant(isButtonDisabled);
	$: if ($page.form?.message) handleError(toastStore, new Error($page.form.message));
</script>

<form method="POST" action="?/enter" use:enhance on:submit={() => localStorage.clear()}>
	<!-- Username entry -->
	<label class="label">
		<span class="font-bold small-gap">Your Username</span>
		<input
			class="input"
			title="username"
			name="username"
			type="text"
			placeholder="Player1"
			bind:value={username}
			required
		/>
		{#if !isValidUsername}
			<p class="text-sm italic text-tertiary-700">
				{config.maxUsernameLength} letters (must start with it), numbers and dashes
			</p>
		{/if}
	</label>
	<slot />
	<!-- Submit button -->
	<button
		type="submit"
		disabled={isButtonDisabled}
		class="{buttonVariant} btn-xl rounded-lg w-full mb-5">Go!</button
	>
	{#if isButtonDisabled}
		<p class="text-sm italic text-center pb-2 text-tertiary-700">
			Valid username required to proceed!
		</p>
	{/if}
</form>
<div class="flex justify-center py-3">
	<button type="button" class="btn btn-sm variant-ringed" on:click={() => goto('/')}
		>Return home</button
	>
</div>
