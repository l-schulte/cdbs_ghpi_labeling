import { fail } from "@sveltejs/kit";
import { Client, Query } from 'ts-postgres';
import type { Actions, PageServerLoad } from "./$types";
import { getIssue } from "../../shared/issue";
import { checkUserToken, dbConfig } from "../variables";


const client = new Client(dbConfig);
await client.connect();

export const load = (async (event) => {

    console.log("GET", event.cookies.getAll(), event.route);


    const userToken = event.cookies.get('userToken')
    const user = await checkUserToken(userToken, client)
    if (user == null) {
        throw Error("Unauthorized")
    }

    const result_issue = await client.query('SELECT * FROM gh_issues WHERE status = $1 AND is_privacy_related IS NULL ORDER BY random() LIMIT 1', ['closed']).one()

    const labels: string[] = result_issue.get('labels').map((label: string) => label.toLowerCase())
    const labelMap: { [key: string]: string } = {}

    if (labels.length) {
        const q = new Query('SELECT * FROM gh_label_map WHERE original_label IN (' + labels.map((label, index) => `$${index + 1}`).join(', ') + ')', [...labels])

        const resultLabelMap = await client.execute(q)
        for (const row of resultLabelMap) {
            labelMap[row.get('original_label')] = row.get('harmonized_label')
        }
    }

    const resultAllLabels = await client.query('SELECT DISTINCT harmonized_label FROM gh_label_map')
    const allHarmonizedLabels: string[] = [...resultAllLabels].map(row => row.get('harmonized_label')).sort((a: string, b: string) => a.localeCompare(b));

    const issue = getIssue(client, result_issue, labelMap)

    return {
        issue,
        user,
        allHarmonizedLabels
    }
}) satisfies PageServerLoad

export const actions = {
    default: async (event) => {
        const userToken = event.cookies.get('userToken')
        if (await checkUserToken(userToken, client) == null) {
            return fail(401, { userToken, incorrect: true })
        }

        const data = await event.request.formData()
        console.log('harmonize', data);

        const index = data.get('index')
        data.delete('index')

        const isPrivacyRelated = data.has('isPrivacyRelated')
        data.delete('isPrivacyRelated')

        await client.query('UPDATE gh_issues SET is_privacy_related = $1, notes = $2 WHERE index = $3', [isPrivacyRelated, data.get('notes'), index])

        for (const [originalLabel, harmonizedLabel] of data.entries()) {
            if (harmonizedLabel.toString().length) {
                await client.query('INSERT INTO gh_label_map (original_label, harmonized_label) VALUES ($1, $2)', [originalLabel.toLowerCase(), harmonizedLabel.toString().toLowerCase()])
            }
        }

        // throw error(418, { message: "Server Error" })
    }
} satisfies Actions