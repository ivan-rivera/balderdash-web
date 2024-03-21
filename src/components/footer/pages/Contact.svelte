<script>
	// TODO: connect to backend
	import { getButtonVariant } from '$lib/utils';
	let isButtonDisabled = false;
	let email = '';
	let message = '';
	$: buttonVariant = getButtonVariant(isButtonDisabled);
	const onSubmit = () => {
		console.log('submitted');
	};
</script>

<div class="footer-page-pad">
	<h1 class="h1">Contact</h1>
	<br class="pb-5" />
	<p>
		If you would like to submit feedback or get in touch with the developer for any other reason,
		please use the below form
	</p>
	<br class="pb-5" />
	<form action="submit">
		<label class="label">
			<span>Your email (optional)</span>
			<input class="input" type="text" placeholder="someone@email.com" bind:value={email} />
		</label>
		<br class="pb-5" />
		<label class="label">
			<span>Message</span>
			<textarea
				class="textarea"
				rows="4"
				placeholder="I would like to suggest..."
				bind:value={message}
			/>
		</label>
	</form>
	<br class="pb-5" />
	<div class="flex justify-center">
		<button
			type="button"
			disabled={isButtonDisabled}
			class="{buttonVariant} btn-xl rounded-lg w-full mb-5 max-w-xl mx-auto"
			on:click|preventDefault={onSubmit}>Submit</button
		>
	</div>
	{#if isButtonDisabled}
		<p class="text-sm italic text-center pb-2 text-tertiary-700">Enter a longer message</p>
	{/if}
</div>
