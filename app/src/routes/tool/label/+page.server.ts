import { fail } from '@sveltejs/kit';
import { Client } from 'ts-postgres';
import type { Actions, PageServerLoad } from './$types';
import { getIssue } from '../../shared/issue';
import { dbConfig } from '../variables';

const client = new Client(dbConfig);
await client.connect();

export const load = (async ({ cookies, url }) => {
	const userToken = cookies.get('userToken');
	const reCodeStart = url.searchParams.get('recode-start');
	const reCodeEnd = url.searchParams.get('recode-end');
	const reCodePage = Number(url.searchParams.get('recode-page') ?? 0);
	const tokenCheck = await checkUserToken(userToken);
	if (tokenCheck == null) {
		throw Error('Unauthorized');
	}

	const [username, userId] = tokenCheck;

	const query =
		`SELECT * FROM gh_issues WHERE status = $1 AND is_privacy_related = $2` +
		(!!reCodeStart && !!reCodeEnd
			? ` AND (last_edit_rater_${userId + 1
			} ::timestamp > timestamp '${reCodeStart}' AND last_edit_rater_${userId + 1
			} ::timestamp <= timestamp '${reCodeEnd}')` +
			` ORDER BY last_edit_rater_${userId + 1} DESC offset ${reCodePage}`
			: ` AND privacy_issue_rater_${userId + 1} IS NULL ORDER BY random() LIMIT 1`);

	const result_issue = await client.query(query, ['closed', true]).one();

	const labelMap: { [key: string]: string } = {};

	const resultLabelMap = await client.query('SELECT * FROM gh_label_map');
	for (const row of resultLabelMap) {
		labelMap[row.get('original_label')] = row.get('harmonized_label');
	}

	const resultUserTriggerOptions = await client.query(
		`SELECT DISTINCT trigger_rater_${userId + 1} as options FROM gh_issues`
	);
	const triggerOptions = [...resultUserTriggerOptions]
		.map((row) => row.get('options'))
		.filter((option) => option)
		.sort((a: string, b: string) => a.localeCompare(b));

	const resultUserPrivacyIssueOptions = await client.query(
		`SELECT DISTINCT privacy_issue_rater_${userId + 1} as options FROM gh_issues`
	);
	const privacyIssueOptions = [...resultUserPrivacyIssueOptions]
		.map((row) => row.get('options'))
		.filter((option) => option)
		.sort((a: string, b: string) => a.localeCompare(b));

	const resultUserConsentInteractionOptions = await client.query(
		`SELECT DISTINCT consent_interaction_rater_${userId + 1} as options FROM gh_issues`
	);
	const consentInteractionOptions = [...resultUserConsentInteractionOptions]
		.map((row) => row.get('options'))
		.filter((option) => option)
		.sort((a: string, b: string) => a.localeCompare(b));

	const resultUserResolutionOptions = await client.query(
		`SELECT DISTINCT resolution_rater_${userId + 1} as options FROM gh_issues`
	);

	const resolutionOptions = [...resultUserResolutionOptions]
		.map((row) => row.get('options'))
		.filter((option: string) => option)
		.sort((a: string, b: string) => a.localeCompare(b));

	const issue = getIssue(client, result_issue, labelMap, userId);

	return {
		issue,
		username,
		triggerOptions,
		privacyIssueOptions,
		consentInteractionOptions,
		resolutionOptions
	};
}) satisfies PageServerLoad;

async function checkUserToken(token: string | undefined): Promise<[string, number] | null> {
	if (!token) {
		return null;
	}

	const result = await client.query('SELECT * FROM users WHERE token = $1', [token]).one();
	return [result?.get('name'), Number.parseInt(result?.get('index'))] ?? null;
}

export const actions = {
	default: async (event) => {
		const userToken = event.cookies.get('userToken');
		const tokenCheck = await checkUserToken(userToken);
		if (tokenCheck == null) {
			return fail(403, { userToken, incorrect: true });
		}

		const [, userId] = tokenCheck;

		const data = await event.request.formData();
		console.log('label', data);

		const index = data.get('index');
		data.delete('index');

		const templateMentionsPrivacy = data.has('templateMentionsPrivacy')
		data.delete('templateMentionsPrivacy')

		const isPrivacyRelated = data.has('isPrivacyRelated');
		data.delete('isPrivacyRelated');

		if (!isPrivacyRelated) {
			await client.query(
				'UPDATE gh_issues SET is_privacy_related = $1, notes = $2, template_mentions_privacy= $3 WHERE index = $4',
				[false, data.get('notes'), templateMentionsPrivacy, index]
			);
		} else {
			await client.query(
				`UPDATE gh_issues SET trigger_rater_${userId + 1} = $1, ` +
				`privacy_issue_rater_${userId + 1} = $2, ` +
				`consent_interaction_rater_${userId + 1} = $3, ` +
				`resolution_rater_${userId + 1} = $4, ` +
				`notes = $5, last_edit_rater_${userId + 1} = now(), ` +
				`template_mentions_privacy = $6 ` +
				`WHERE index = $7`,
				[
					...[
						data.get('trigger'),
						data.get('privacyIssue'),
						data.get('consentInteraction'),
						data.get('resolution')
					].map((value) => value?.toString().toLowerCase()),
					data.get('notes'),
					templateMentionsPrivacy,
					index
				]
			);
		}
	}
} satisfies Actions;
