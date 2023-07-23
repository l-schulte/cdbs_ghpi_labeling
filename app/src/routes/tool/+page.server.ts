import { Client, Query } from 'ts-postgres';
import { checkUserToken, dbConfig } from './variables';
import type { PageServerLoad } from './$types';

const client = new Client(dbConfig);
await client.connect();

export const load = (async (event) => {
	const userToken = event.cookies.get('userToken');
	const user = await checkUserToken(userToken, client);
	if (user == null) {
		throw Error('Unauthorized');
	}

	const resultIssuesRelatedToPrivacy = await client
		.query('SELECT COUNT(*) FROM gh_issues WHERE is_privacy_related = $1', [true])
		.one();
	const resultIssuesNotRelatedToPrivacy = await client
		.query('SELECT COUNT(*) FROM gh_issues WHERE is_privacy_related = $1', [false])
		.one();

	const resultUsers = await client.query('SELECT index, name FROM users LIMIT 2');
	const userProgress: [string, string][] = [];
	for (const row of resultUsers) {
		const username = row.get('name');

		const index = Number.parseInt(row.get('index')) + 1;
		const query = new Query(
			`SELECT COUNT(*) FROM gh_issues ` +
				`WHERE is_privacy_related = false AND consent_interaction_rater_${index} IS NOT NULL ` +
				`AND resolution_rater_${index} IS NOT NULL AND privacy_issue_rater_${index} IS NOT NULL`
		);

		const progress = await client.execute(query).one();
		userProgress.push([username, progress.get('count')]);
	}

	const resultNumberOfIssues = await client.query('SELECT COUNT(*) FROM gh_issues').one();

	return {
		numberOfPrivacyIssues: resultIssuesRelatedToPrivacy.get('count'),
		numberOfNonPrivacyIssues: resultIssuesNotRelatedToPrivacy.get('count'),
		userProgress,
		numberOfIssues: resultNumberOfIssues.get('count')
	};
}) satisfies PageServerLoad;
