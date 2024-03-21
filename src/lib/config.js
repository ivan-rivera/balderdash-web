const config = {
    devPort: 4173,
    appVersion: "2.0.0",
    maxUsernameLength: 12,
    errorTimeout: 5000,
    minPlayersRequired: 3,
    sessionId: {
        numCharacters: 5,
        numIntegers: 3,
    },
    rounds: {
        "min": 4,
        "max": 15,
    },
    aiGuesses: {
        "min": 0,
        "max": 3,
    },
    categories: [
        { // TODO: update sources to URLs
            name: "Rare words",
            description: "Guess the definition",
            source: "words.json",
            enabled: true,
        },
        {
            name: "Acronyms",
            description: "Guess what they stand for",
            source: "acronyms.json",
            enabled: true,
        },
        {
            name: "Scientific names",
            description: "Guess the common name",
            source: "latin.json",
            enabled: true,
        },
        {
            name: "Film taglines",
            description: "Guess the tagline",
            source: "taglines.json",
            enabled: true,
        },
        {
            name: "Famous people",
            description: "Guess what they are famous for",
            source: "people.json",
            enabled: true,
        },
    ]
}

export { config };
