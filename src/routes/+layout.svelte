<script>
	import { handleError } from '$lib/utils';
	import { signIn } from '$lib/firebase/auth';
	import { FIREBASE } from '$lib/constants';
	import { firebaseApp } from '$lib/firebase/client';
	import { AppShell, Modal, Toast, getToastStore, initializeStores } from '@skeletonlabs/skeleton';
	import { onMount, setContext } from 'svelte';
	import '../app.postcss';
	import Footer from '../components/footer/Footer.svelte';
	import Kick from '../components/modals/Kick.svelte';
	import Prompt from '../components/modals/Prompt.svelte';
	import Header from '../components/globals/Header.svelte';

	initializeStores();
	const toastStore = getToastStore();
	const modalRegistry = {
		prompt: { ref: Prompt },
		kick: { ref: Kick },
	};
	setContext(FIREBASE, firebaseApp);
	onMount(
		async () =>
			await signIn(firebaseApp)
				.then((cred) => (document.cookie = `uid=${cred}`))
				.catch((error) => handleError(toastStore, new Error(error))),
	);
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
