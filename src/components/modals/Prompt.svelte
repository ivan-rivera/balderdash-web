<script>
	/**
	 * @typedef {import("$lib/types.js").Category} Category
	 */
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { getButtonVariant, getCategoryWords, toTitleCase } from '$lib/utils';
	import { session } from '$lib/store';
	import config from '$lib/config';
	import { enhance } from '$app/forms';
	import { CATEGORY, PROMPT, RESPONSE, SESSION } from '$lib/constants';
	import posthog from 'posthog-js';

	const modalStore = getModalStore();
	const { categories, data } = session;

	let selectedCategory = $categories[0];
	let customPrompt = '';
	let customResponse = '';
	let { prompt, response } = getCategoryWords(/** @type {Category} */ (selectedCategory));
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
	<form
		id="custom"
		action="?/select.prompt.customize"
		method="POST"
		use:enhance
		on:submit={() => {
			posthog.capture('custom_prompt', {
				category: selectedCategory,
				prompt: customPrompt,
				response: customResponse,
			});
			modalStore.close();
		}}
	>
		<input type="text" name={SESSION} value={JSON.stringify($data)} hidden />
		<div class="border-t-0 bg-surface-400" />
		<label class="label">
			<span class="text-lg">Category</span>
			<select name={CATEGORY} class="select" bind:value={selectedCategory}>
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
				id="custom"
				name={PROMPT}
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
				id="custom"
				name={RESPONSE}
				placeholder="Your own {response}..."
				bind:value={customResponse}
				minlength={config.customPrompt.minResponseLength}
				maxlength={config.customPrompt.maxResponseLength}
				required
			/>
			<span class="text-right text-xs">
				{#if customResponse.length < config.customPrompt.minResponseLength}
					<span>
						Your {response} must contain at least {config.customPrompt.minResponseLength} characters
					</span>
				{:else}
					<span>
						Characters: {customResponse.length} out of {config.customPrompt.maxResponseLength}
					</span>
				{/if}
			</span>
		</label>
		<div class="flex justify-center w-full gap-x-5">
			<button
				class="btn btn-lg variant-filled my-2 rounded-lg"
				on:click|preventDefault={() => modalStore.close()}
				>Cancel
			</button>
			<button
				class="btn btn-lg {buttonVariant} my-2 rounded-lg"
				type="submit"
				disabled={submitButtonIsDisabled}
				>Submit
			</button>
		</div>
	</form>
</div>
