<script lang="ts">
	import '@picocss/pico';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getCookie } from 'typescript-cookie';

	export let data: PageData;
	let userToken = getCookie('userToken');

	let numHarmonizedLabels = 1;

	onMount(() => {
		window.open(
			`https://github.com/${data.issue.project}/issues/${data.issue.number}`,
			'github',
			'popup=true,resize=true,width=600,height=400,left=200,top=200'
		);
	});

	async function nextIssue() {
		window.open(
			`/loading`,
			'github',
			'popup=true,resize=true,width=600,height=400,left=200,top=200'
		);
		window.location.href = '/work';
	}
</script>

<!-- BODY -->

<nav>
	<ul>
		<li><strong>Privacy issues on GitHub</strong></li>
	</ul>
	<ul>
		<li><a href="/help">Help</a></li>
	</ul>
</nav>

{#if data}
	<div class="content">
		<article>
			<header>Variables</header>

			<div class="category split">
				<p>Reported: <kbd>{new Date(data.issue.reported).toLocaleDateString('DE')}</kbd></p>
				<p>Last active: <kbd>{new Date(data.issue.lastActive).toLocaleDateString('DE')}</kbd></p>
			</div>

			<div class="category split">
				{#if data.issue.harmonizedLabels}
					<p>
						Harmonized labels:
						{#each data.issue.labels as label}
							<kbd>{label}</kbd>
						{/each}
					</p>
				{:else}
					<p>
						Labels:
						{#each data.issue.labels as label}
							<kbd>{label}</kbd>
						{/each}
					</p>
				{/if}

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
						{#each data.issue.participants as participant}
							<tr>
								<td>{participant.reporter ? '✅' : '❌'}</td>
								<td>{participant.login}</td>
								<td>{participant.commits}</td>
								<td>{participant.reports}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="category split">
				<p>#Comments: <kbd>{data.issue.comments}</kbd></p>
				<p>#Discussants: <kbd>{data.issue.discussants}</kbd></p>
			</div>
		</article>

		{#if data.issue.isPrivacyRelated == null}
			<article>
				<header>Manual harmonization</header>
				<form method="post" action="?/harmonize">
					<label for="harmonizedLabels">
						Harmonized labels
						{#each [...Array(numHarmonizedLabels).keys()] as cnt}
							<input type="text" id="harmonizedLabels_{cnt}" name="harmonizedLabels" />
						{/each}
						<button type="button" class="secondary outline" on:click={() => numHarmonizedLabels++}>
							+
						</button>
					</label>

					<label class="checkboxLabel" for="isPrivacyRelated">
						<input type="checkbox" id="isPrivacyRelated" name="isPrivacyRelated" checked />
						Is privacy related
					</label>
					<button>Submit</button>
				</form>
			</article>
		{:else}
			<article>
				<header>Manual coding</header>
				<form method="post" action="coding">
					<label for="privacyIssue">
						Privacy issue
						<input type="text" id="privacyIssue" name="privacyIssue" required />
					</label>

					<label for="consentInteraction">
						Consent interaction
						<input type="text" id="consentInteraction" name="consentInteraction" required />
					</label>

					<label for="resolution">
						Resolution
						<input type="text" id="resolution" name="resolution" required />
					</label>
					<button>Submit</button>
				</form>
			</article>
		{/if}
	</div>
{:else}
	<div class="content loading">
		<a href="/help" aria-busy="true">Fetching data, please wait…</a>
	</div>
{/if}

<div class="navigation-wrapper">
	<button class="secondary" on:click={nextIssue}>Skip</button>
</div>

<!-- STYLE -->

<style lang="scss">
	:global(body) {
		margin: 0;
	}

	nav {
		position: sticky;
		top: 0;
		padding: 0 20px;
		background-color: var(--background-color);
	}

	.navigation-wrapper {
		position: sticky;
		bottom: 0px;
		padding: 10px;
		width: 100%;
		background-color: var(--background-color);

		// button {
		// 	margin-bottom: 5px;
		// 	height: 40px;
		// 	line-height: 40px;
		// 	padding: 0;
		// }
	}

	.content {
		display: flex;
		flex-wrap: wrap;

		padding: 10px;

		article {
			min-width: 900px;
			flex: 1 1 0px;
			margin: 10px;
			header {
				margin-bottom: 10px;
			}

			.checkboxLabel {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: flex-end;
				margin-bottom: 25px;
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

		&.loading {
			height: 85vh;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
