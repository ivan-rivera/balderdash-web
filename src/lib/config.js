export default {
	devPort: 4173,
	backendEnabled: true,
	url: 'https://www.balderdash.app',
	appVersion: '2.0.0',
	jwtTokenExpiration: '1h',
	toastTimeout: 5000,
	maxUsernameLength: 12,
	minPlayersRequired: 3,
	customPrompt: {
		minPromptLength: 2,
		maxPromptLength: 64,
		minResponseLength: 4,
		maxResponseLength: 300,
	},
	timer: {
		default: 60,
		increment: 10,
		min: 30,
		max: 120,
	},
	sessionId: {
		numCharacters: 5,
		numIntegers: 3,
	},
	rounds: {
		default: 4,
		min: 4,
		max: 15,
	},
	ais: {
		default: 0,
		min: 0,
		max: 3,
	},
	categories: [
		{
			name: 'Rare words',
			description: 'Guess the definition',
			source:
				'https://raw.githubusercontent.com/ivan-rivera/balderdash-web/main/static/dev/words.json',
			enabled: true,
			promptName: 'word',
			responseName: 'definition',
		},
		{
			name: 'Scientific names',
			description: 'Guess the common name',
			source:
				'https://raw.githubusercontent.com/ivan-rivera/balderdash-web/main/static/dev/latin.json',
			enabled: true,
			promptName: 'Latin name',
			responseName: 'common name',
		},
		{
			name: 'Film taglines',
			description: 'Guess the tagline',
			source:
				'https://raw.githubusercontent.com/ivan-rivera/balderdash-web/main/static/dev/taglines.json',
			enabled: true,
			promptName: 'film title',
			responseName: 'tagline',
		},
		{
			name: 'Famous people',
			description: 'Guess why they are famous',
			source:
				'https://raw.githubusercontent.com/ivan-rivera/balderdash-web/main/static/dev/people.json',
			enabled: true,
			promptName: 'person',
			responseName: 'claim to fame',
		},
	],
};
