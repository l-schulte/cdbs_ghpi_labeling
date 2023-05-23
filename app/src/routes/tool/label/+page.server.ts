import { fail } from "@sveltejs/kit";
import { Client, Query } from 'ts-postgres';
import type { Actions, PageServerLoad } from "./$types";
import { getIssue } from "../../shared/issue";
import { dbConfig } from "../variables";

const client = new Client(dbConfig);
await client.connect();



export const load = (async (event) => {

    console.log("GET", event.cookies.getAll(), event.route);


    const userToken = event.cookies.get('userToken')
    const tokenCheck = await checkUserToken(userToken)
    if (tokenCheck == null) {
        throw Error("Unauthorized")
    }

    const [username, userId] = tokenCheck

    const result_issue = await client.query('SELECT * FROM gh_issues WHERE status = $1 AND is_privacy_related = $2 ORDER BY random() LIMIT 1', ['closed', true]).one()

    const labelMap: { [key: string]: string } = {}

    const resultLabelMap = await client.query('SELECT * FROM gh_label_map')
    for (const row of resultLabelMap) {
        labelMap[row.get('original_label')] = row.get('harmonized_label')
    }

    const resultUserPrivacyIssueOptions = await client.query(`SELECT DISTINCT privacy_issue_rater_${userId + 1} as options FROM gh_issues`)
    const privacyIssueOptions = [...resultUserPrivacyIssueOptions].map(row => row.get('option'));

    const resultUserConsentInteractionOptions = await client.query(`SELECT DISTINCT consent_interaction_rater_${userId + 1} as options FROM gh_issues`)
    const consentInteractionOptions = [...resultUserConsentInteractionOptions].map(row => row.get('option'));

    const resultUserResolutionOptions = await client.query(`SELECT DISTINCT resolution_rater_${userId + 1} as options FROM gh_issues`)
    const resolutionOptions = [...resultUserResolutionOptions].map(row => row.get('option'));

    const issue = getIssue(client, result_issue, labelMap)

    return {
        issue,
        username,
        privacyIssueOptions,
        consentInteractionOptions,
        resolutionOptions
    }
}) satisfies PageServerLoad

async function checkUserToken(token: string | undefined): Promise<[string, number] | null> {
    if (!token) {
        return null
    }

    const result = await client.query('SELECT * FROM users WHERE token = $1', [token]).one()
    return [result?.get('name'), Number.parseInt(result?.get('index'))] ?? null
}

export const actions = {
    default: async (event) => {
        const userToken = event.cookies.get('userToken')
        if (await checkUserToken(userToken) == null) {
            return fail(403, { userToken, incorrect: true })
        }

        const data = await event.request.formData()
        const cookies = event.cookies.getAll()
        console.log('Coding', data);

        // throw error(418, { message: "Server Error" })
    }
} satisfies Actions