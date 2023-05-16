import { fail } from "@sveltejs/kit";
import { Client, Query } from 'ts-postgres';
import type { Actions, PageServerLoad } from "./$types";
import { resultToIssue } from "../../shared/issue";


const client = new Client({ host: 'db', port: 5432, user: 'postgres', password: 'postgres', database: 'postgres' });
await client.connect();

export const load = (async (event) => {

    console.log("GET", event.cookies.getAll(), event.route);


    const userToken = event.cookies.get('userToken')
    const user = await checkUserToken(userToken)
    if (user == null) {
        throw Error("Unauthorized")
    }

    const result_issue = await client.query('SELECT * FROM gh_issues WHERE status = $1 AND is_privacy_related IS NULL ORDER BY random() LIMIT 1', ['closed']).one()

    const labels: string[] = result_issue.get('labels')
    const labelMap: { [key: string]: string } = {}

    if (labels.length) {
        const q = new Query('SELECT * FROM gh_label_map WHERE original_label IN (' + labels.map((label, index) => `$${index + 1}`).join(', ') + ')',
            [...labels.map((label: string) => label.toLowerCase())])

        const resultLabelMap = await client.execute(q)
        for (const row of resultLabelMap) {
            labelMap[row.get('original_label')] = row.get('harmonized_label')
        }
    }

    const resultAllLabels = await client.query('SELECT DISTINCT harmonized_label FROM gh_label_map')
    const allHarmonizedLabels: string[] = []
    for (const row of resultAllLabels) {
        allHarmonizedLabels.push(row.get('harmonized_label'))
    }

    const issue = resultToIssue(result_issue, labelMap)

    return {
        issue,
        user,
        allHarmonizedLabels
    }
}) satisfies PageServerLoad

async function checkUserToken(token: string | undefined) {
    if (!token) {
        return null
    }

    const result = await client.query('SELECT * FROM users WHERE token = $1', [token]).one()
    return result?.get('name') ?? null
}

export const actions = {
    default: async (event) => {
        const userToken = event.cookies.get('userToken')
        if (await checkUserToken(userToken) == null) {
            return fail(401, { userToken, incorrect: true })
        }

        const data = await event.request.formData()
        console.log('harmonize', data);

        const index = data.get('index')
        data.delete('index')

        const isPrivacyRelated = data.has('isPrivacyRelated')
        data.delete('isPrivacyRelated')

        await client.query('UPDATE gh_issues SET is_privacy_related = $1 WHERE index = $2', [isPrivacyRelated, index])

        for (const [originalLabel, harmonizedLabel] of data.entries()) {
            await client.query('INSERT INTO gh_label_map (original_label, harmonized_label) VALUES ($1, $2)', [originalLabel.toLowerCase(), harmonizedLabel.toString().toLowerCase()])
        }

        // throw error(418, { message: "Server Error" })
    }
} satisfies Actions