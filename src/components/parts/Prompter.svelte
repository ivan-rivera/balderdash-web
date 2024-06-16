<script>
	import { USERNAME } from '$lib/constants';
	import { round } from '$lib/store';
	import { getContext } from 'svelte';
	import Fa from 'svelte-fa';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { getCategoryWords } from '$lib/utils';

	$: ({ response: responseDescriptor } = getCategoryWords($category));
	const {
		dasher,
		category,
		prompt: roundPrompt,
		response: roundResponse,
		custom: isCustomPrompt,
	} = round;

	export let withInfo;
	let user = getContext(USERNAME);
	$: userIsDasher = $dasher == user;
</script>

<div class="border box-color rounded-lg py-2 text-center">
	{#if $isCustomPrompt}
		<p class="text-xs underline italic">Custom Prompt</p>
	{/if}
	<h2 class="h2 py-2 text-primary-400">{$roundPrompt}</h2>
	{#if userIsDasher && withInfo}
		<h4 class="h4 italic pb-2 mx-2">{$roundResponse}</h4>
	{/if}
	{#if withInfo}
		<span class="arranged small-gap text-xs">
			<span><Fa icon={faCircleExclamation} /></span>
			{#if userIsDasher}
				<span>As</span>
				<span class="text-primary-400">dasher</span>
				<span>only you can see the {responseDescriptor}</span>
			{:else}
				<span>Only </span>
				<span class="text-primary-400">dasher</span>
				<span>can see the {responseDescriptor}</span>
			{/if}
		</span>
	{/if}
	<div class="border border-x-0 border-b-0 box-color max-w-xs sm:max-w-sm mx-auto" />
	<div>
		<span class="arranged pt-4">
			<span>Category: </span>
			<span class="text-primary-400">{$category}</span>
		</span>
	</div>
</div>

<style>
	.arranged {
		@apply inline-flex gap-x-1 items-center justify-center w-full text-sm sm:text-base;
	}
</style>
