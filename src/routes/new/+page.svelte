<script>
    import { goto } from '$app/navigation';
    import Fa from 'svelte-fa';
    import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
    import { RangeSlider, SlideToggle } from '@skeletonlabs/skeleton';
    import config from '$lib/config';

    let categories = config.categories;
    let roundsChoice = config.rounds.min;
    let aiChoice = config.aiGuesses.min;
    let username = "";
    $: isValidUsername = /^[a-zA-Z][a-zA-Z0-9-]{0,11}$/.test(username);
    $: isButtonDisabled = !isValidUsername || username.length === 0;
    $: buttonVariant = isButtonDisabled ? "variant-ghost": "variant-filled";
    function goHome() { goto('/') }

    /** @param {string} text */
    let textToId = (text) => text.toLowerCase().replace(/\s/g, '-');
    let submitHandler = () => {
        console.log("it worked");
    }
</script>

<main>
    <!-- New Game heading -->
    <h1 class="h1 text-center">New Game</h1>
    <span class="inline-flex spreader gap-x-1 items-center justify-center w-full">
        <span class="text-lg"><Fa icon={faCircleExclamation}/></span>
        <span>Make sure you are familiar with the <span class="attention">rules</span> before you start!</span>
    </span>
    <form id="new-session">
        <!-- Username entry -->
        <label class="label spreader">
            <div class="font-bold">Your Username</div>
            <input class="input" title="username" type="text" placeholder="Player1" bind:value={username} required/>
            {#if !isValidUsername}
                <p class="text-sm italic text-tertiary-700">
                    You can choose up to {config.maxUsernameLength} letters (must start with one), numbers and dashes
                </p>
            {/if}
        </label>
        <!-- Number of rounds selection -->
        <div class="spreader">
            <RangeSlider name="round-slider" bind:value={roundsChoice} max={config.rounds.max} step={1} ticked>
                <div class="flex justify-between items-center">
                    <div class="font-bold">Number Of Rounds</div>
                    <div class="text-xs">{roundsChoice} / {config.rounds.max}</div>
                </div>
            </RangeSlider> 
            <p>We recommend at least 1 round per player</p>    
        </div>  
        <!-- AI guesses selection -->
        <div class="spreader">
            <RangeSlider name="ai-slider" bind:value={aiChoice} max={config.aiGuesses.max} step={1} ticked>
                <div class="flex justify-between items-center">
                    <div class="font-bold">AI Guesses</div>
                    <div class="text-xs">{aiChoice} / {config.aiGuesses.max}</div>
                </div>
            </RangeSlider>
            <p>You can add phony AI answers to make the game more fun</p>    
        </div>
        <!-- Categories to include selection -->
        <div class="spreader">
            <div class="font-bold">Categories To Include</div>
            <div class="spreader">
                {#each categories as category}
                    <SlideToggle name='slider-{textToId(category.name)}' bind:checked={category.enabled}>
                        <span class="inline-block text-left">
                            <span class="text-primary-500">{category.name}</span>: {category.description}
                        </span>
                    </SlideToggle>
                {/each}
            </div>
        </div>
        <!-- Submit button -->
        <button
            type="button"
            disabled={isButtonDisabled}
            class="{buttonVariant} btn-xl rounded-lg w-full mb-5" 
            on:click|preventDefault={submitHandler}
        >Go!</button>
        {#if !isValidUsername}
            <p class="text-sm italic text-center pb-2 text-tertiary-700">Valid username required to proceed!</p>
        {/if}
    </form>
    <div class="flex justify-center py-3">
        <button type="button" class="btn btn-sm variant-ringed" on:click={goHome}>Return home</button>
    </div>
</main>

<style>
    .spreader {
        @apply py-2;
    }
</style>
