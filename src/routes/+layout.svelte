<script>
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '../components/footer/Footer.svelte'; 
	import Header from '../components/Header.svelte';
	initializeStores();
</script>

<AppShell>
	<Header/>
	<div class="max-w-lg mx-auto">
		<slot/>
	</div>
	<svelte:fragment slot="footer">
		<Footer/>
	</svelte:fragment>
</AppShell>
