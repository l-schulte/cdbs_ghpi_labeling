<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from './$types';
	import Autocomplete from '../../shared/autocomplete.svelte';

	export let data: PageData;
</script>

<article>
	<header>Manual coding</header>
	<form method="post">
		<label for="privacyIssue">
			Privacy issue
			<Autocomplete formName="privacyIssue" value="" options={data.privacyIssueOptions} />
		</label>

		<label for="consentInteraction">
			Consent interaction
			<Autocomplete
				formName="consentInteraction"
				value=""
				options={data.consentInteractionOptions}
			/>
		</label>

		<label for="resolution">
			Resolution
			<Autocomplete formName="resolution" value="" options={data.resolutionOptions} />
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
</style>
