import About from './pages/About.svelte';
import Contact from './pages/Contact.svelte';
import Legal from './pages/Legal.svelte';
import Rules from './pages/Rules.svelte';

/**
 * @type {{ [key: string]: SvelteComponent }}
 * @description Mapping from string to Footer component.
 */
export const pages = {
    "About": About,
    "Contact": Contact,
    "Legal": Legal,
    "Rules": Rules,
}
