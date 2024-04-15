<script>
	/**
	 * @typedef {import("$lib/types.js").Category} Category
	 */
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getButtonVariant, getCategoryWords, toTitleCase } from '$lib/utils';
	import { session } from '$lib/store';
	import { config } from '$lib/config';
	import { sessionManagerStore } from '$lib/store';

	const modalStore = getModalStore();
	const { categories } = session;

	let selectedCategory = $categories[0];
	let customPrompt = '';
	let customResponse = '';
	let { prompt, response } = getCategoryWords(/** @type {Category} */ (selectedCategory));
	async function submitCustomPrompt() {
		// TODO: handle exceptions?
		await $sessionManagerStore.setCustomPrompt(customPrompt, customResponse, selectedCategory);
		modalStore.close();
	}
	$: submitButtonIsDisabled =
		customPrompt.length < config.customPrompt.minPromptLength ||
		customResponse.length < config.customPrompt.minResponseLength;
	$: buttonVariant = getButtonVariant(submitButtonIsDisabled);
</script>

<div class="balderdash-modal">
	<h2 class="h2">Set your own prompt</h2>
	<p class="text-xs">
		You can set your own prompt-response pair. Please respect the selected category, this will allow
		us to insert appropriate phony responses if a guesser fails to submit a response in time
	</p>
	<div class="border-t-0 bg-surface-400" />
	<label class="label">
		<span class="text-lg">Category</span>
		<select class="select" bind:value={selectedCategory}>
			{#each $categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>
	</label>
	<label class="label">
		<span class="text-lg">{toTitleCase(prompt)}</span>
		<input
			class="input"
			type="text"
			placeholder="My custom {prompt}..."
			bind:value={customPrompt}
			minlength={config.customPrompt.minPromptLength}
			maxlength={config.customPrompt.maxPromptLength}
			required
		/>
	</label>
	<div class="text-right text-xs">
		{#if customPrompt.length < config.customPrompt.minPromptLength}
			<span>
				Your {prompt} must contain at least {config.customPrompt.minPromptLength} characters
			</span>
		{:else}
			<span>
				Characters: {customPrompt.length} out of {config.customPrompt.maxPromptLength}
			</span>
		{/if}
	</div>
	<label class="label">
		<span class="text-lg">{toTitleCase(response)}</span>
		<textarea
			class="textarea"
			rows="4"
			placeholder="Your own {response}..."
			bind:value={customResponse}
			minlength={config.customPrompt.minResponseLength}
			maxlength={config.customPrompt.maxResponseLength}
			required
		/>
		<div class="text-right text-xs">
			{#if customResponse.length < config.customPrompt.minResponseLength}
				<span>
					Your {response} must contain at least {config.customPrompt.minResponseLength} characters
				</span>
			{:else}
				<span>
					Characters: {customResponse.length} out of {config.customPrompt.maxResponseLength}
				</span>
			{/if}
		</div>
	</label>
	<div class="flex justify-center w-full gap-x-5">
		<button
			class="btn btn-lg variant-filled my-2 rounded-lg"
			on:click|preventDefault={() => modalStore.close()}
			>Cancel
		</button>
		<button
			class="btn btn-lg {buttonVariant} my-2 rounded-lg"
			disabled={submitButtonIsDisabled}
			on:click|preventDefault={submitCustomPrompt}
			>Submit
		</button>
	</div>
</div>
