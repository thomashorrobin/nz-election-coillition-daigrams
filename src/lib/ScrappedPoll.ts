export type ScrappedPoll = {
    id: Uint8Array;
    date: string;
    company: string;
    results: Map<string, number>;
    reportedPercentage: Map<string, number>;
}

export async function generatePollSHA256(pollDateRange: string, pollingCompany: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${pollDateRange}${pollingCompany}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hash);
}
