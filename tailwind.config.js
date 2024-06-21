import { join } from 'path';

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
	],
	theme: {
		extend: {
			minWidth: {
				'2xs': '375px',
				xs: '400px',
			},
		},
		screens: {
			'2xs': '375px',
			sm: '400px',
			...defaultTheme.screens,
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [{ name: 'crimson', enhancements: true }],
			},
		}),
	],
};
