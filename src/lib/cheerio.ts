import { Cheerio, load } from 'cheerio';

export type ScrappedPoll = {
    id: number;
    date: string;
    company: string;
    results: Map<string, number>;
}

export async function fetchWikipediaPolls(): Promise<string> {
    return fetch('https://en.wikipedia.org/w/api.php?action=parse&page=Opinion_polling_for_the_2023_New_Zealand_general_election&format=json&origin=*')
        .then(extractTextFromResponse)
        .then(parsePolling2023PageHTML)
}

export async function extractTextFromResponse(res: Response): Promise<string> {
    const json = await res.json();
    const text = json.parse.text['*'];
    if (text) {
        return text;
    } else {
        throw new Error('Wikipedia API response was not JSON');
    }
}

async function parsePolling2023PageHTML(html: string): Promise<string> {
    const $ = load(html);
    const tables = $('table');
    // console.log('table count', tables.length)
    let biggestTable:Cheerio<Element> | undefined = undefined;
    for (let i = 0; i < tables.length; i++) {
        const tableRef = $(tables[i]);
        const recordCount = tableRef.find('tr').length;
        if (recordCount > 132) {
            // @ts-ignore
            biggestTable = tableRef;
        }
    }
    if (biggestTable) {
        // @ts-ignore
        return `<table>${$(biggestTable).html()}</table>` ?? '<p>no data</p>';
    }
    throw new Error('No table found');
}
