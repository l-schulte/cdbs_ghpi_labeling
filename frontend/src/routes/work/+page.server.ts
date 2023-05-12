import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {

    const issue = {
        id: Math.floor(Math.random() * 100),
        reported: new Date('01.01.2023'),
        lastActive: new Date(),
        labels: ['bug', 'feature'],
        status: 'closed',
        participants: [
            {
                author: true,
                login: 'l-schulte',
                commits: Math.floor(Math.random() * 100),
                reports: Math.floor(Math.random() * 100)
            }
        ],
        comments: Math.floor(Math.random() * 100),
        discussants: Math.floor(Math.random() * 100)
    }

    return {
        issue
    }
}) satisfies PageServerLoad

export const actions = {
    default: async (event) => {
        const data = await event.request.formData()
        console.log('Hej världen', data);

    }
} satisfies Actions