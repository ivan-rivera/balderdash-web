<script>
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { SESSION, USERNAME } from '$lib/constants';
	import { round, sessionData } from '$lib/store';
	import { getContext } from 'svelte';
	import { getCategoryWords } from '$lib/utils';
	import Prompter from '../parts/Prompter.svelte';
	import Fa from 'svelte-fa';
	import { faXmarkCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
	import { enhance } from '$app/forms';
	const { dasher, guesses, category } = round;
	let user = getContext(USERNAME);
	const userSelections = Object.entries($guesses).reduce((acc, [user, guess]) => {
		acc[user] = guess.correct ? 1 : 0;
		return acc;
	}, /** @type {Object.<string, number>} */ ({}));
	$: userIsDasher = $dasher === user;
	$: ({ response } = getCategoryWords($category));
</script>

<Prompter withInfo={true} />
{#if !userIsDasher}
	<p class="text-center pt-5">The dasher is marking responses...</p>
	<p class="text-center pt-5 text-sm">
		If your response is close enough to the official {response}, it will be marked by the dasher as
		correct and you will be awarded points for it!
	</p>
{/if}
{#if userIsDasher}
	<p class="text-center pt-5">Mark correct responses</p>
	<p class="text-center text-sm">
		Only if the {response} is close enough to the official version given above, then mark it as correct
	</p>
	<form action="?/mark.continue" method="POST" use:enhance>
		<input type="text" name={SESSION} value={JSON.stringify($sessionData)} hidden />
		{#each Object.entries($guesses) as [user, guess]}
			<div class="card my-5">
				<div class="card-header text-xs">User: {user}</div>
				<section class="p-4 italic">{guess.response}</section>
				<div class="mx-auto text-center">
					<RadioGroup active="variant-filled-secondary" class="mb-5">
						<RadioItem bind:group={userSelections[user]} name={user} value={1}
							><Fa icon={faCheckCircle} size="lg" /></RadioItem
						>
						<RadioItem bind:group={userSelections[user]} name={user} value={0}
							><Fa icon={faXmarkCircle} size="lg" /></RadioItem
						>
					</RadioGroup>
				</div>
			</div>
		{/each}
		<button class="btn variant-filled btn-lg rounded-lg w-full" type="submit">Submit</button>
	</form>
{/if}
