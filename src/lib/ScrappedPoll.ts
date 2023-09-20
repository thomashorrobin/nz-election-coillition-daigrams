export type ScrappedPoll = {
    id: number;
    date: string;
    company: string;
    results: Map<string, number>;
    reportedPercentage: Map<string, number>;
}
