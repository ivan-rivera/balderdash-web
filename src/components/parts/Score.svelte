<script>
    /**
	 * @typedef {import("$lib/types").Scoreboard} Scoreboard
	 */
    import { session } from '$lib/store';
    const { scoreboard } = session;

    /**
	 * Sorts the scores of players in descending order
	 * @param {Scoreboard} scores
	 */
	function sortScores(scores) {
		return Object.entries(scores).sort(([, a], [, b]) => b - a);
	}
</script>

<div class="table-container">
	<table class="table">
		<thead>
			<tr>
				<th>Player</th>
				<th class="table-sort-dsc">Score</th>
			</tr>
		</thead>
		<tbody>
			{#each sortScores($scoreboard) as [player, score]}
				<tr>
					<td>{player}</td>
					<td>{score}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
