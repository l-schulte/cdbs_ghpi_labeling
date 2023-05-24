<script lang="ts">
	import '@picocss/pico';
	import type { PageData as PDLabel } from '../tool/label/$types';
	import type { PageData as PDHarmonize } from '../tool/harmonize/$types';
	import { onMount } from 'svelte';

	export let data: PDLabel | PDHarmonize;

	let harmonizedLabels: string[] = [];

	onMount(() => {
		harmonizedLabels = data.issue.labels
			.filter((label: string) => data.issue.labelMap[label])
			.map((label: string) => data.issue.labelMap[label]);
	});

	function getNumberRep(num: number) {
		return num <= 1 ? num : 'multiple';
	}
</script>

<!-- BODY -->

<article>
	<details>
		<summary>Other issue variables</summary>
		<div class="category split">
			<p>Reported: <kbd>{new Date(data.issue.reported).toLocaleDateString('DE')}</kbd></p>
			<p>Last active: <kbd>{new Date(data.issue.lastActive).toLocaleDateString('DE')}</kbd></p>
		</div>

		<div class="category split">
			<p>
				Harmonized labels:
				{#each harmonizedLabels as label}
					<kbd>{label}</kbd>
				{/each}
			</p>

			<p>Status: <kbd>{data.issue.status}</kbd></p>
		</div>

		<div class="category">
			<p>Participants:</p>
			<table role="grid">
				<thead>
					<tr>
						<th scope="col">Reporter</th>
						<th scope="col">Username</th>
						<th scope="col">Commits</th>
						<th scope="col">Issues reported</th>
					</tr>
				</thead>
				<tbody>
					{#each data.issue.participants
						.sort((a, b) => b.login.localeCompare(a.login))
						.sort((a, b) => (a.reporter ? 0 : 1)) as participant}
						<tr>
							<td>{participant.reporter ? '✅' : ''}</td>
							<td>{participant.login}</td>
							<td>{getNumberRep(participant.commits)}</td>
							<td>{getNumberRep(participant.reports)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="category split">
			<p>#Comments: <kbd>{data.issue.comments}</kbd></p>
			<p>#Discussants: <kbd>{data.issue.discussants}</kbd></p>
		</div>
	</details>
</article>

<!-- STYLE -->

<style lang="scss">
	article {
		min-width: 900px;
		flex: 1 1 0px;
		margin: 10px;
		header {
			margin-bottom: 10px;
		}
	}

	.category {
		p {
			margin-top: 10px;
			margin-bottom: 5px;
		}

		kbd {
			margin-left: 5px;
			margin-bottom: 5px;
		}

		&.split {
			display: flex;

			p {
				width: 100%;
			}
		}
	}
</style>
