<script>
    // TODO: pass validation message from using component
    import { config } from '$lib/config';
	import { getButtonVariant } from '$lib/utils';
	import { goto } from '$app/navigation';

    export let submitButtonEnabled = true;
    let usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]{0,11}$/;
    let username = "";
    $: isValidUsername = usernameRegex.test(username);
    $: isButtonDisabled = !isValidUsername || !submitButtonEnabled
    $: buttonVariant = getButtonVariant(isButtonDisabled)

    let goHome = () => { goto('/') }

     /**
	 * @prop {(event: SubmitEvent) => void} onSubmit - submit handle function
	 * @type {() => void}
	 */
      export let onSubmit;
</script>

<form id="session">
    <!-- Username entry -->
    <label class="label">
        <div class="font-bold small-gap">Your Username</div>
        <input class="input" title="username" type="text" placeholder="Player1" bind:value={username} required/>
        {#if !isValidUsername}
            <p class="text-sm italic text-tertiary-700">
                You can choose up to {config.maxUsernameLength} letters (must start with one), numbers and dashes
            </p>
        {/if}
    </label>
   <slot/>
    <!-- Submit button -->
    <button
        type="button"
        disabled={isButtonDisabled}
        class="{buttonVariant} btn-xl rounded-lg w-full mb-5" 
        on:click|preventDefault={onSubmit}
    >Go!</button>
    {#if isButtonDisabled}
        <p class="text-sm italic text-center pb-2 text-tertiary-700">Valid username required to proceed!</p>
    {/if}
</form>
<div class="flex justify-center py-3">
    <button type="button" class="btn btn-sm variant-ringed" on:click={goHome}>Return home</button>
</div>