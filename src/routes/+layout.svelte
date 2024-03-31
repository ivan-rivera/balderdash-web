<script>
	import '../app.postcss';
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '../components/footer/Footer.svelte';
	import Header from '../components/Header.svelte';
	import Prompt from '../components/modals/Prompt.svelte';
	import Kick from '../components/modals/Kick.svelte';
	const modalRegistry = {
		prompt: { ref: Prompt },
		kick: { ref: Kick },
	};
	initializeStores();
</script>

<Modal components={modalRegistry} />
<Toast />
<AppShell>
	<Header />
	<div class="min-w-2xs max-w-lg mx-auto px-5">
		<slot />
	</div>
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
