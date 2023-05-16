import type { ResultRow } from "ts-postgres";

export function resultToIssue(result_issue: ResultRow, labelMap: { [key: string]: string }) {
    return {
        index: result_issue.get('index'),
        number: result_issue.get('issue_number'),
        project: result_issue.get('project'),
        reported: result_issue.get('reporting_date'),
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
}