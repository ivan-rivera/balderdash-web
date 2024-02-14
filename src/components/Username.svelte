<script>
    import { config, usernameRegex } from '$lib/config';
    let username = "";
    $: isValidUsername = usernameRegex.test(username);
    // TODO: validate username against the server for /join
</script>


<label class="label">
    <div class="font-bold">Your Username</div>
    <input class="input" title="username" type="text" placeholder="Player1" bind:value={username} required/>
    {#if !isValidUsername}
        <p class="text-sm italic text-tertiary-700">
            You can choose up to {config.maxUsernameLength} letters (must start with one), numbers and dashes
        </p>
    {/if}
</label>
