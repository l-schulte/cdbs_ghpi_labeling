import type { ResultRow, Client } from "ts-postgres";


export async function getIssue(client: Client, result_issue: ResultRow, labelMap: { [key: string]: string }, userId: number | null = null) {
    const project: string = result_issue.get('project')
    const reporter_login = result_issue.get('reporter')
    const discussant_logins: string[] = result_issue.get('discussants')

    const resultParticipants = await client.query('SELECT * FROM gh_participants WHERE project = $1 AND login IN (' + [reporter_login, ...discussant_logins].map((_, index) => `$${index + 2}`).join(', ') + ')', [project, reporter_login, ...discussant_logins])

    const participants = []
    for (const row of resultParticipants) {
        const login = row.get('login')
        console.log(login);

        participants.push({
            reporter: login == reporter_login,
            login: login,
            commits: row.get('commits'),
            reports: row.get('reports')
        })
    }

    return {
        ...{
            index: result_issue.get('index'),
            number: result_issue.get('issue_number'),
            project: project,
            reported: result_issue.get('reporting_date'),
            lastActive: result_issue.get('last_active_date'),
            labels: result_issue.get('labels').map((label: string) => label.toLowerCase()),
            status: result_issue.get('status'),
            participants: participants,
            comments: result_issue.get('#comments'),
            discussants: result_issue.get('#discussants'),
            labelMap: labelMap,
            isPrivacyRelated: result_issue.get('is_privacy_related'),
            notes: result_issue.get('notes')
        }, codes: userId !== null ? {
            trigger: result_issue.get('trigger_rater_' + (userId + 1)),
            privacy_issue: result_issue.get('privacy_issue_rater_' + (userId + 1)),
            consent_interaction: result_issue.get('consent_interaction_rater_' + (userId + 1)),
            resolution: result_issue.get('resolution_rater_' + (userId + 1))
        } : {}
    }
}