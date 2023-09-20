import { Cheerio, load } from 'cheerio';
import { ScrappedPoll } from './ScrappedPoll';

const ESTIMATED_VOTERS = 2_919_073 // voters in 2020 election

export async function fetchWikipediaPolls(): Promise<ScrappedPoll[]> {
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

function parseVoters(publishedPercent: string): number {
    return Math.floor(parseFloat(publishedPercent) * ESTIMATED_VOTERS / 100);
}

async function parsePolling2023PageHTML(html: string): Promise<ScrappedPoll[]> {
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
    let scrappedPolls = Array<ScrappedPoll>();
    // @ts-ignore
    $(biggestTable).find('tr').each((i, row) => {
        const cells = $(row).find('td');
        if (cells.length > 5) {
            const date = $(cells[0]).text();
            const company = $(cells[1]).text();
            const results = new Map<string, number>();
            const reportedPercentage = new Map<string, number>();

            results.set('Labour', parseVoters($(cells[3]).text()));
            results.set('National', parseVoters($(cells[4]).text()));
            results.set('Greens', parseVoters($(cells[5]).text()));
            results.set('ACT', parseVoters($(cells[6]).text()));
            results.set('Maori Party', parseVoters($(cells[7]).text()));
            results.set('NZ First', parseVoters($(cells[8]).text()));

            reportedPercentage.set('Labour', parseFloat($(cells[3]).text()));
            reportedPercentage.set('National', parseFloat($(cells[4]).text()));
            reportedPercentage.set('Greens', parseFloat($(cells[5]).text()));
            reportedPercentage.set('ACT', parseFloat($(cells[6]).text()));
            reportedPercentage.set('Maori Party', parseFloat($(cells[7]).text()));
            reportedPercentage.set('NZ First', parseFloat($(cells[8]).text()));

            scrappedPolls.push({ id: i, date, company, results, reportedPercentage });
        }
    }
    );
    if (biggestTable) {
        return scrappedPolls;
    }
    throw new Error('No table found');
}
