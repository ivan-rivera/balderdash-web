/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'bun run build && bun run preview',
		port: 4173,
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	// timeout: 3000,
	use: {
		ignoreHTTPSErrors: true,
	},
};

export default config;
