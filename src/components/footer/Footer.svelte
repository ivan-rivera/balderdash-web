<script>
    // @ts-nocheck
    /**
     * Footer Definition
     * This file contains the navigation bar at the bottom of the page together with
     * a link to the GitHub repo, version number and the theme switch.
     * This file also defines the drawer that is used to display the help pages
     */

    import { getDrawerStore, Drawer, LightSwitch } from '@skeletonlabs/skeleton';
    import { faGithub } from '@fortawesome/free-brands-svg-icons';
    import Fa from 'svelte-fa';
    import config from '$lib/config';
    import { pages } from './content';

    const drawerStore = getDrawerStore();
    const drawerSettings = {rounded: 'rounded-xl', position: 'bottom'}
</script>

<div>
    <div class="footer-row border-t-2 border-primary-500">
        {#each Object.keys(pages) as page}
        <a href={'#'} on:click={() => drawerStore.open({id: page, ...drawerSettings})}>
            <h5>{page}</h5>
        </a>
        {/each}
    </div>
    <div class="footer-row px-5 py-2">
        <a class="text-xl" href="https://github.com/balderdash-app/balderdash-web"><Fa icon={faGithub}/></a>
        <p class="text-sm">Version {config.appVersion}</p>
        <LightSwitch/>
    </div>
</div>
<Drawer>
	<svelte:component this={pages[$drawerStore.id]} />
</Drawer>


<style>
    .footer-row {
        @apply flex justify-center align-middle gap-x-7 px-5 py-2;
    }
</style>
