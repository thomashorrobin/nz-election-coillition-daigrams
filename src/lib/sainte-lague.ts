import { ScrappedPoll } from "./ScrappedPoll";
// @ts-ignore
import sainteLague from 'sainte-lague';


export function calculateSeats(poll: ScrappedPoll, assumedMaoriSeats: number): Map<string, number> {
    let sainteLagueObject = {};
    if (poll.reportedPercentage.get("NZ First") ?? 0 < 5) {
        poll.results.set("NZ First", 0);
    }
    poll.results.forEach((value, key) => {
        // @ts-ignore
        sainteLagueObject[key] = value;
    });

    const parliament = sainteLague(sainteLagueObject, 120, {draw: true})
    parliament["Maori Party"] = Math.max(parliament["Maori Party"], assumedMaoriSeats);

    let newMap = new Map<string, number>();

    Object.keys(parliament).forEach((key) => {
        newMap.set(key, parliament[key]);
    });

    return newMap;
}