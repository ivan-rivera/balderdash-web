import { PostHog } from 'posthog-node';
import { dev } from '$app/environment';
import {
	PUBLIC_DEV_POSTHOG_API_KEY,
	PUBLIC_DEV_POSTHOG_HOST,
	PUBLIC_PROD_POSTHOG_API_KEY,
	PUBLIC_PROD_POSTHOG_HOST,
} from '$env/static/public';

export const client = new PostHog(dev ? PUBLIC_DEV_POSTHOG_API_KEY : PUBLIC_PROD_POSTHOG_API_KEY, {
	host: dev ? PUBLIC_DEV_POSTHOG_HOST : PUBLIC_PROD_POSTHOG_HOST,
});
