<script>
    // TODO: validate username against the server
    // TODO: validate valid session ID
	import Username from '../../components/Username.svelte';
    
    let sessionId = "";
    let isValidSessionId = true;

    $: isButtonDisabled = !isValidSessionId || false; // TODO: username.length === 0 pass username from component?
    $: buttonVariant = isButtonDisabled ? "variant-ghost": "variant-filled"; // TODO: combined these in utils?

    let submitHandler = () => {
        console.log("it worked");
    }
</script>

<main>
    <!-- Heading -->
    <h1 class="h1 text-center">Join Game</h1>
    <form id="join-session">
            <Username/>
            <label class="label">
                <div class="font-bold">Session ID</div>
                <input class="input" title="username" type="text" placeholder="ABCD1234" bind:value={sessionId} required/>
                {#if !isValidSessionId}
                    <p class="text-sm italic text-tertiary-700">
                        The session ID you entered is not valid
                    </p>
                {/if}
            </label>
            <button
                type="button"
                disabled={isButtonDisabled}
                class="{buttonVariant} btn-xl rounded-lg w-full mb-5" 
                on:click|preventDefault={submitHandler}
            >Go!</button>
    </form>
</main>