import { load } from 'cheerio';

export type ScrappedPoll = {
    id: number;
    date: string;
    company: string;
    results: Map<string, number>;
}

export function fetchWikipediaPolls(): ScrappedPoll[] {
    return [{id: 2, date: '17th March', company: "roy morgan", results: new Map<string, number>()}, {id: 3, date: '13th March', company: "colmer brunton", results: new Map<string, number>()}];
}
