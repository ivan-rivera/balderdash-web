const config = {
    devPort: 4173,
    appVersion: "2.0.0",
    maxUsernameLength: 12,
    rounds: {
        "min": 4,
        "max": 15,
    },
    aiGuesses: {
        "min": 0,
        "max": 3,
    },
    categories: [
        {
            name: "Rare words",
            description: "Guess the definition",
            source: "some-url",
            enabled: true,
        },
        {
            name: "Acronyms",
            description: "Guess what they stand for",
            source: "some-url",
            enabled: true,
        },
        {
            name: "Scientific names",
            description: "Guess the common name",
            source: "some-url",
            enabled: true,
        },
        {
            name: "Film taglines",
            description: "Guess the tagline",
            source: "some-url",
            enabled: true,
        },
        {
            name: "Famous people",
            description: "Guess what they are famous for",
            source: "some-url",
            enabled: true,
        },
    ]
}

export { config };
