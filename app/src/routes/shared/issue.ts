import type { ResultRow, Client } from "ts-postgres";


export async function getIssue(client: Client, result_issue: ResultRow, labelMap: { [key: string]: string }) {
    const project: string = result_issue.get('project')
    const reporter_login = result_issue.get('reporter')
    const discussant_logins: string[] = result_issue.get('discussants')

    const resultParticipants = await client.query("SELECT * FROM gh_participants WHERE project = $1 AND login IN ($2)", [project, discussant_logins.join(', ')])

    const participants = []
    for (const row of resultParticipants) {
        const login = row.get('login')
        participants.push({
            reporter: login == reporter_login,
            login: login,
            commits: row.get('commits'),
            reports: row.get('reports')
        })
    }

    return {
        index: result_issue.get('index'),
        number: result_issue.get('issue_number'),
        project: project,
        reported: result_issue.get('reporting_date'),
        lastActive: result_issue.get('last_active_date'),
        labels: result_issue.get('labels'),
        status: result_issue.get('status'),
        participants: participants,
        comments: result_issue.get('#comments'),
        discussants: result_issue.get('#discussants'),
        labelMap: labelMap,
        isPrivacyRelated: result_issue.get('is_privacy_related')
    }
}