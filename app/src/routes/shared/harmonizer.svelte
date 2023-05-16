<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from '../tool/$types';
	import { onMount } from 'svelte';
	import Autocomplete from './autocomplete.svelte';

	export let data: PageData;

	let nonHarmonizedLabels: string[] = [];

	onMount(() => {
		nonHarmonizedLabels = data.issue.labels.filter((label: string) => !data.issue.labelMap[label]);
		console.log({ nonHarmonizedLabels, labels: data.issue.labels, labelMap: data.issue.labelMap });
	});
</script>

<article>
	<header>Manual harmonization</header>
	<form method="post" action="?/harmonize">
		<input type="hidden" id="index" name="index" value={data.issue.index} />
		{#if nonHarmonizedLabels.length}
			<label for="harmonizedLabels">
				Harmonize labels:
				{#each nonHarmonizedLabels as label}
					<div class="label-mapper">
						<div class="label-wrapper"><kbd>{label}</kbd></div>
						<Autocomplete formName={label} value="" options={data.allHarmonizedLabels} />
					</div>
				{/each}
			</label>
		{/if}

		<label class="checkboxLabel" for="isPrivacyRelated">
			<input type="checkbox" id="isPrivacyRelated" name="isPrivacyRelated" checked />
			Is privacy related
		</label>
		<button type="submit">Submit</button>
	</form>
</article>

<style lang="scss">
	article {
		min-width: 900px;
		flex: 1 1 0px;
		margin: 10px;
		header {
			margin-bottom: 10px;
		}

		.label-mapper {
			display: flex;
			justify-content: center;
			align-items: baseline;
			margin-bottom: 15px;

			.label-wrapper {
				height: 100%;
				width: 50%;

				kbd {
					margin-left: 5px;
					margin-bottom: 5px;
				}
			}
		}

		.checkboxLabel {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: flex-end;
			margin-bottom: 25px;
		}
	}
</style>
