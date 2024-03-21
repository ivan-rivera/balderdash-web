<script>
	import DasherSelecting from './DasherSelecting.svelte';
	import GuesserSelecting from './GuesserSelecting.svelte';
    export let userIsDasher = false;
</script>
<svelte:component this={userIsDasher ?  DasherSelecting : GuesserSelecting} />
