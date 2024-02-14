<script>
    // TODO: add resume button and validate game on mount
    import { goto } from '$app/navigation';
    function goToNew() { goto('/new') }
    function goToJoin() { goto('/join') }
</script>

<div class="flex flex-col items-center justify-center mx-auto">
    <div class="py-5">
        <h2 class="h2 py-2">Balderdash • /ˈbɔːldədaʃ/</h2>
        <h3 class="h3">senseless talk or writing; nonsense</h3>
    </div>
    <div class="flex flex-col items-center justify-center space-y-5 p-10">
        <h1 class="h1">Menu</h1>
        <button name="start-game" type="button" class="variant-filled action-button" on:click={goToNew}>Start Game</button>
        <button name="new-game" type="button" class="variant-filled action-button" on:click={goToJoin}>Join Game</button>
    </div>
    <p>
        The iconic party game of bluffing and trivia! Guess or craft clever
        definitions for a mix of obscure words, people, acronyms, and more. 
        Perfect for 4-8 players seeking a fun, brain-teasing challenge!
    </p>
</div>

<style>
    .action-button {
        @apply btn-xl rounded-lg;
    }
</style>
