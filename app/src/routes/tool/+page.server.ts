import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Client } from 'ts-postgres';


const client = new Client({ host: 'db', port: 5432, user: 'postgres', password: 'postgres', database: 'postgres' });
await client.connect();



export const load = (async (event) => {

    console.log("GET", event.cookies.getAll());

    const userToken = event.cookies.get('userToken')
    const user = await checkUserToken(userToken)
    if (user == null) {
        throw Error("Unauthorized")
    }

    const result_issue = await client.query('SELECT * FROM gh_issues ORDER BY random() LIMIT 1').one()

    const labels = result_issue.get('labels')
    const resultLabelMap = await client.query('SELECT * FROM gh_label_map WHERE original_label IN ($1)', [labels.map((label: string) => label.toLowerCase()).join(', ')])
    const labelMap: { [key: string]: string } = {}
    for (const row of resultLabelMap) {
        labelMap[row.get('original_label')] = row.get('harmonized_label')
    }

    const resultAllLabels = await client.query('SELECT DISTINCT harmonized_label FROM gh_label_map')
    const allHarmonizedLabels: string[] = []
    for (const row of resultAllLabels) {
        allHarmonizedLabels.push(row.get('harmonized_label'))
    }

    const issue = {
        index: result_issue.get('index'),
        number: result_issue.get('issue_number'),
        project: result_issue.get('project'),
        reported: result_issue.get('reported_date'),
        lastActive: result_issue.get('last_active_date'),
        labels: result_issue.get('labels'),
        status: result_issue.get('status'),
        participants: [
            {
                reporter: true,
                login: result_issue.get('reporter'),
                commits: Math.floor(Math.random() * 100),
                reports: Math.floor(Math.random() * 100)
            },
            ...(result_issue.get('discussants')).filter((login: string) => login != result_issue.get('reporter')).map((login: string) => {
                return ({
                    reporter: false,
                    login: login,
                    commits: Math.floor(Math.random() * 100),
                    reports: Math.floor(Math.random() * 100)
                })
            })

        ],
        comments: result_issue.get('#comments'),
        discussants: result_issue.get('#discussants'),
        labelMap: labelMap,
        isPrivacyRelated: result_issue.get('is_privacy_related')
    }

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
    coding: async (event) => {
        const userToken = event.cookies.get('userToken')
        if (await checkUserToken(userToken) == null) {
            return fail(403, { userToken, incorrect: true })
        }

        const data = await event.request.formData()
        const cookies = event.cookies.getAll()
        console.log('Coding', data);

        // throw error(418, { message: "Server Error" })
    },
    harmonize: async (event) => {
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