import { browser, dev } from '$app/environment';
import {
	PUBLIC_DEV_POSTHOG_API_KEY,
	PUBLIC_DEV_POSTHOG_HOST,
	PUBLIC_PROD_POSTHOG_API_KEY,
	PUBLIC_PROD_POSTHOG_HOST,
} from '$env/static/public';
import posthog from 'posthog-js';

export const load = async () => {
	if (browser) {
		posthog.init(dev ? PUBLIC_DEV_POSTHOG_API_KEY : PUBLIC_PROD_POSTHOG_API_KEY, {
			api_host: dev ? PUBLIC_DEV_POSTHOG_HOST : PUBLIC_PROD_POSTHOG_HOST,
			person_profiles: 'always',
		});
	}
};
