export interface Issue {
    id: string;
    reported: Date;
    lastActive: Date;
    labels: string[];
    status: string;
    participants: Participant[];
    comments: number;
    discussants: number;
}

export interface Participant {
    author?: boolean;
    login: string;
    commits: number;
    reports: number;
}
