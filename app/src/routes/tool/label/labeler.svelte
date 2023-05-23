<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from './$types';
	import Autocomplete from '../../shared/autocomplete.svelte';

	export let data: PageData;

	let isPrivacyRelated = data.issue.isPrivacyRelated;
</script>

<article>
	<header>Manual coding</header>
	<form method="post">
		<input type="hidden" id="index" name="index" value={data.issue.index} />

		<label for="privacyIssue">
			Privacy issue
			<Autocomplete
				formName="privacyIssue"
				value=""
				options={data.privacyIssueOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="consentInteraction">
			Consent interaction
			<Autocomplete
				formName="consentInteraction"
				value=""
				options={data.consentInteractionOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="resolution">
			Resolution
			<Autocomplete
				formName="resolution"
				value=""
				options={data.resolutionOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label class="checkboxLabel" for="isPrivacyRelated">
			<input
				type="checkbox"
				id="isPrivacyRelated"
				name="isPrivacyRelated"
				bind:checked={isPrivacyRelated}
			/>
			Is privacy related (only change if wrongly classified)
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
	}

	.category {
		p {
			margin-top: 10px;
			margin-bottom: 5px;
		}

		&.split {
			display: flex;

			p {
				width: 100%;
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
</style>
