<script>
	import { SCORE } from '$lib/score';
</script>

<div class="footer-page-pad">
	<h1 class="h1">Rules</h1>
	<br class="pb-5" />
	<p>
		Balderdash is a popular board game where players concoct convincing but false responses to a
		prompt. The game revolves around the dynamic of a "prompt" and "response" pairs that depend on
		the category -- e.g. if the category is "rare words", then the prompt will be a word and the
		response will be the definition of that word, whereas in the context of film taglines the prompt
		will be a movie title and the response will be the tagline.
	</p>

	<br class="pb-5" />

	<br class="pb-5" />
	<p>The game is played in rounds where one person is the dasher and all others are guessers</p>
	<br class="pb-5" />
	<p>
		The dasher selects a prompt (e.g. rare word, acronym, etc) and the guessers must find the
		matching response (e.g. definition)
	</p>
	<br class="pb-5" />
	<p>
		The guessers must submit their answers within a pre-defined time limit, if they do not, then
		they will still be able to participate in the game by voting for other answers
	</p>
	<br class="pb-5" />
	<p>
		Guessers can choose to submit a "double bluff" response -- if they do so, then every vote that
		their submission receives will gain {SCORE.DB.POSITIVE} points instead of the usual {SCORE.VOTE_RECEIVED},
		however, if their response does not get a single vote, then they will lose {SCORE.DB.NEGATIVE} points.
		Note that if a double-bluff submission is marked as "correct" by the dasher, then the double-bluff
		flag has no effect, it is only applicable to phony answers.
	</p>
	<br class="pb-5" />
	<p>
		Once all responses are submitted, the dasher marks those that match the true response (e.g. the
		correct word definition)
	</p>
	<br class="pb-5" />
	<p>
		Next, all wrong responses along with a single correct one are presented to the guessers in
		random order and they must find the correct one.
	</p>
	<br class="pb-5" />
	<p>Player with the highest score at the end of the game wins</p>
	<br class="pb-5" />
	<h3 class="h3">Scoring</h3>
	<br class="pb-5" />
	<ol class="list">
		<li>
			<span>1.</span>
			<span class="flex-auto"
				>The dasher gets <strong>{SCORE.DASHER.UNGUESSED} points</strong> if no one guesses (not votes)
				the correct answer</span
			>
		</li>
		<li>
			<span>2.</span>
			<span class="flex-auto"
				>Players who submit responses close to the true answer get <strong
					>{SCORE.CORRECT_GUESS} points</strong
				></span
			>
		</li>
		<li>
			<span>3.</span>
			<span class="flex-auto"
				>Players who find the correct answer during the voting stage get <strong
					>{SCORE.CORRECT_VOTE} points</strong
				></span
			>
		</li>
		<li>
			<span>4.</span>
			<span class="flex-auto"
				>Players get <strong>{SCORE.VOTE_RECEIVED} point</strong> per vote that their phony answers receive</span
			>
		</li>
		<li>
			<span>5.</span>
			<span class="flex-auto"
				>Double bluff rules apply as outlined above: <strong>{SCORE.DB.POSITIVE}</strong> for every
				vote, <strong>{SCORE.DB.NEGATIVE}</strong> if no votes received</span
			>
		</li>
	</ol>
	<br class="pb-5" />
</div>
