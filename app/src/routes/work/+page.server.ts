import type { Actions, PageServerLoad } from "./$types";
import { Client } from 'ts-postgres';


const client = new Client({ host: 'localhost', port: 5432, user: 'postgres', password: 'example', database: 'github' });
await client.connect();


export const load = (async () => {
    console.log("GET");

    const result = await client.query('SELECT * FROM gh_issues ORDER BY random() LIMIT 1').one()

    console.log(result);


    const issue = {
        number: result.get('issue_number'),
        project: result.get('project'),
        reported: result.get('reported_date'),
        lastActive: result.get('last_active_date'),
        labels: result.get('labels'),
        status: result.get('status'),
        participants: [
            {
                reporter: true,
                login: result.get('reporter'),
                commits: Math.floor(Math.random() * 100),
                reports: Math.floor(Math.random() * 100)
            },
            ...(result.get('discussants')).map((login: string) => {
                return ({
                    reporter: false,
                    login: login,
                    commits: Math.floor(Math.random() * 100),
                    reports: Math.floor(Math.random() * 100)
                })
            })

        ],
        comments: result.get('#comments'),
        discussants: result.get('#discussants'),
        harmonizedLabels: result.get('harmonized_labels'),
        isPrivacyRelated: result.get('is_privacy_related')
    }

    return {
        issue
    }
}) satisfies PageServerLoad

export const actions = {
    coding: async (event) => {
        const data = await event.request.formData()
        const cookies = await event.cookies.getAll()
        console.log('Coding', data, cookies);
    },
    harmonize: async (event) => {
        const data = await event.request.formData()
        const cookies = await event.cookies.getAll()
        console.log('harmonize', data, cookies);

    }
} satisfies Actions