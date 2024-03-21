<script>
	import '../app.postcss';
	import { AppShell, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '../components/footer/Footer.svelte';
	import Header from '../components/Header.svelte';
	initializeStores();
</script>

<Toast />
<AppShell>
	<Header />
	<div class="max-w-lg mx-auto">
		<slot />
	</div>
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
