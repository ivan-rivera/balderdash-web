# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

Todo items:
- Upgrade Firebase to Blaze
- Firebase security rules
- Add another sub-state to dasher marking: grouping stage where dasher groups similar phony responses
- Add double-bluff logic: guessers can opt for a double bluff, if no one votes for them or if their answer is correct, they get minus 3 points, but if someone does vote for them, each vote counts for 2
- Add a scoreboard to footer (look for appropriate progress bars)
- Test header
- Test /new (user validation, categories, button, conditional text, home, launch)
- Set up /join
- Test /join (validation, home, launch)
- Adapt for mobile
- Write meta pages
- Hook up Firebase
- ...
- Integration testing with many users?
- Set up GH CI/CD test + deploy

UI TODO:
- Display "you (or PlayerX) is the dasher"
- Display session ID in the footer
- If you have an active session, then expose a "Resume Game" option on the home page -> validate state


TO TEST:
- Username validation
- Entry button disabled

curl -i -X POST http://localhost:5173/refresh