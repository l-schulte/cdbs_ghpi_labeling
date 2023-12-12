<script lang="ts">
	import '@picocss/pico';
	import type { PageData } from './$types';
	import Autocomplete from '../../shared/autocomplete.svelte';

	export let data: PageData;

	let isPrivacyRelated = data.issue.isPrivacyRelated;
	let templateMentionsPrivacy = data.issue.templateMentionsPrivacy;
</script>

<article>
	<header>Manual coding</header>
	<form method="post">
		<input type="hidden" id="index" name="index" value={data.issue.index} />

		<label for="trigger">
			Trigger
			<Autocomplete
				formName="trigger"
				value={data.issue.codes.trigger ?? ''}
				options={data.triggerOptions}
			/>
		</label>

		<label for="privacyIssue">
			Privacy issue
			<Autocomplete
				formName="privacyIssue"
				value={data.issue.codes.privacy_issue ?? ''}
				options={data.privacyIssueOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="consentInteraction">
			Consent interaction
			<Autocomplete
				formName="consentInteraction"
				value={data.issue.codes.consent_interaction ?? ''}
				options={data.consentInteractionOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="resolution">
			Resolution
			<Autocomplete
				formName="resolution"
				value={data.issue.codes.resolution ?? ''}
				options={data.resolutionOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="reason">
			Reason
			<Autocomplete
				formName="reason"
				value={data.issue.codes.reason ?? ''}
				options={data.reasonOptions}
				required={isPrivacyRelated}
			/>
		</label>

		<label for="notes">
			Notes
			<textarea
				id="notes"
				name="notes"
				value={data.issue.notes ?? ''}
				placeholder="Create a public note here..."
			/>
		</label>

		<div class="checkboxLabel">
			<label class="checkboxLabel" for="templateMentionsPrivacy">
				<input
					type="checkbox"
					id="templateMentionsPrivacy"
					name="templateMentionsPrivacy"
					bind:checked={templateMentionsPrivacy}
				/>
				Template mentions privacy
			</label>
		</div>

		<div class="checkboxLabel">
			<label for="isPrivacyRelated">
				<input
					type="checkbox"
					id="isPrivacyRelated"
					name="isPrivacyRelated"
					bind:checked={isPrivacyRelated}
				/>
			</label>
			Is privacy related (only change if wrongly classified)
		</div>
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
		align-items: center;
		margin-bottom: 25px;

		label {
			margin: 3px;
		}
	}
</style>
