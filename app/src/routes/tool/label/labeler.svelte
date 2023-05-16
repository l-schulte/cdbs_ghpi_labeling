<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from '../$types';

	export let data: PageData;
</script>

<article>
	<header>Manual coding</header>
	<form method="post">
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
