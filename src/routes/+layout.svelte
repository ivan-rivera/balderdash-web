<script>
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Nav from '$lib/components/footer/Nav.svelte'; 
	import Header from '$lib/components/Header.svelte';
	initializeStores();
</script>

<AppShell>
	<Header/>
	<div class="max-w-lg mx-auto">
		<slot/>
	</div>
	<svelte:fragment slot="footer">
		<Nav/>
	</svelte:fragment>
</AppShell>
