<script>
	/**
	 * @typedef {import('firebase/app').FirebaseApp} FirebaseApp
	 * */

	import { signIn } from '$lib/auth';
	import { DB_MANAGER } from '$lib/constants';
	import DatabaseManager from '$lib/database';
	import { AppShell, Modal, Toast, getToastStore, initializeStores } from '@skeletonlabs/skeleton';
	import { onMount, setContext } from 'svelte';
	import '../app.postcss';
	import Header from '../components/Header.svelte';
	import Footer from '../components/footer/Footer.svelte';
	import Kick from '../components/modals/Kick.svelte';
	import Prompt from '../components/modals/Prompt.svelte';
	import { firebaseApp } from '$lib/firebase/client';
	import { ClientError, handleError } from '$lib/errors';

	initializeStores();

	const toastStore = getToastStore();

	const modalRegistry = {
		prompt: { ref: Prompt },
		kick: { ref: Kick },
	};

	setContext(DB_MANAGER, new DatabaseManager(firebaseApp));
	onMount(
		async () =>
			await signIn(firebaseApp).catch((error) => handleError(toastStore, new ClientError(error))),
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
