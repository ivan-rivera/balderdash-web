<script>
    // TODO: validate username against the server
    import EntryForm from '../../components/EntryForm.svelte';
    
    let sessionId = "";
    let isValidSessionId = true;  // TODO: validate session ID
    let submitHandler = () => {
        console.log("it worked");
    }
</script>

<main>
    <h1 class="h1 text-center pb-10">Join Game</h1>
    <EntryForm onSubmit={submitHandler} bind:submitButtonEnabled={isValidSessionId}>
        <label class="label">
            <div class="font-bold small-gap">Session ID</div>
            <input class="input" title="username" type="text" placeholder="ABCD1234" bind:value={sessionId} required/>
            {#if !isValidSessionId}
                <p class="text-sm italic text-tertiary-700">
                    The session ID you entered is not valid
                </p>
            {/if}
        </label>
        <br class="pb-5"/>
    </EntryForm>
</main>
