<script>
	import { enhance } from '$app/forms';
	import { getButtonVariant, handleInfo } from '$lib/utils';
	import { ENQUIRY, IDENTITY } from '$lib/constants.js';
	import posthog from 'posthog-js';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toastStore = getToastStore();
	let isButtonDisabled = false;
	let email = '';
	let message = '';
	$: buttonVariant = getButtonVariant(isButtonDisabled);
	const handleSubmit = () => {
		posthog.capture(ENQUIRY);
		handleInfo(toastStore, 'Message sent!');
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
	<form action="?/enquire" method="POST" use:enhance on:submit={handleSubmit}>
		<label class="label">
			<span>Your email (optional)</span>
			<input
				class="input"
				name={IDENTITY}
				type="text"
				placeholder="someone@email.com"
				bind:value={email}
			/>
		</label>
		<br class="pb-5" />
		<label class="label">
			<span>Message</span>
			<textarea
				class="textarea"
				rows="4"
				name={ENQUIRY}
				placeholder="I would like to suggest..."
				bind:value={message}
			/>
		</label>
		<br class="pb-5" />
		<div class="flex justify-center">
			<button
				type="submit"
				disabled={isButtonDisabled}
				class="{buttonVariant} btn-xl rounded-lg w-full mb-5 max-w-xl mx-auto">Submit</button
			>
		</div>
	</form>
	{#if isButtonDisabled}
		<p class="text-sm italic text-center pb-2 text-tertiary-700">Enter a longer message</p>
	{/if}
</div>
