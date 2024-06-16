<script>
	/**
	 * @typedef {import('firebase/database').DatabaseReference} DatabaseReference
	 * @typedef {import("$lib/types").Category} Category
	 */

	import config from '$lib/config';
	import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
	import { RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import Entry from '../../components/forms/Entry.svelte';

	let username = '';
	let categories = config.categories;
	let roundsChoice = config.rounds.min;
	let aiChoice = config.ais.min;

	/** @param {string} text */
	let textToId = (text) => text.toLowerCase().replace(/\s/g, '-');
</script>

<main>
	<!-- New Game heading -->
	<h1 class="h1 text-center">New Game</h1>
	<span class="inline-flex small-gap gap-x-1 items-center justify-center w-full text-xs xs:text-lg">
		<span class="text-lg"><Fa icon={faCircleExclamation} /></span>
		<span>Familiarise yourself with the <span class="attention">rules</span> before you start!</span
		>
	</span>
	<Entry bind:username>
		<!-- Target rounds -->
		<div class="small-gap">
			<RangeSlider
				name="round-slider"
				bind:value={roundsChoice}
				min={config.rounds.min}
				max={config.rounds.max}
				step={1}
				ticked
			>
				<div class="flex justify-between items-center">
					<div class="font-bold">Rounds to play</div>
					<div class="text-xs">{roundsChoice} / {config.rounds.max}</div>
				</div>
			</RangeSlider>
			<p>We recommend at least 1 round per player</p>
		</div>
		<!-- AI guesses selection -->
		<div class="small-gap">
			<RangeSlider name="ai-slider" bind:value={aiChoice} max={config.ais.max} step={1} ticked>
				<div class="flex justify-between items-center">
					<div class="font-bold">AI Guesses</div>
					<div class="text-xs">{aiChoice} / {config.ais.max}</div>
				</div>
			</RangeSlider>
			<p>You can add phony AI answers</p>
		</div>
		<!-- Categories to include selection -->
		<div class="small-gap">
			<div class="font-bold">Categories To Include</div>
			<div class="small-gap">
				{#each categories as category}
					<SlideToggle
						size="sm"
						name="slider-{textToId(category.name)}"
						bind:checked={category.enabled}
					>
						<span class="inline-block text-left text-xs xs:text-base">
							<span class="text-primary-500">{category.name}</span>: {category.description}
						</span>
					</SlideToggle>
				{/each}
			</div>
		</div>
	</Entry>
</main>
