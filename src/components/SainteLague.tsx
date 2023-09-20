import React, { useEffect, useState } from 'react';
import './SainteLague.css';
import { ScrappedPoll } from '../lib/cheerio';
// @ts-ignore
import sainteLague from 'sainte-lague';

function parlimentToRows(parliment: object): JSX.Element[] {
    const tableRows = new Array<JSX.Element>();
    Object.keys(parliment).forEach((key) => {
        // @ts-ignore
        tableRows.push(<tr key={key}><td>{key}</td><td>{parliment[key]}</td></tr>)
    })
    return tableRows;
}

function SainteLagueResultsTable(props:{selectedPoll: ScrappedPoll | null, maoriElectorateSeats: number}): JSX.Element {
    const {selectedPoll, maoriElectorateSeats} = props;
    const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
    useEffect(() => {
        let newObject = {};
        if (!selectedPoll) {
            return;
        }
        // @ts-ignore
        if (selectedPoll.reportedPercentage.get("NZ First") < 5) {
            selectedPoll.results.set("NZ First", 0);
        }
        selectedPoll.results.forEach((value, key) => {
            // @ts-ignore
            newObject[key] = value;
        });
        const seats = 120 // number of seats to be distributed
        const opt = { // options, can be null
	    draw: true // if a draw would be necessary to determine the seat count (e.g. 11 seats and two parties with 100 votes each), the library will throw an error, unless you set draw: true, in which case it will assert the ambiguous seat(s) randomly
            }

            const parliament = sainteLague(newObject, seats, opt)
            parliament["Maori Party"] = Math.max(parliament["Maori Party"], maoriElectorateSeats);
            setTableRows(parlimentToRows(parliament));
    }, [selectedPoll, maoriElectorateSeats])
    if (!selectedPoll) {
        return <div></div>
    }
    return (
        <div>
            <table className='table-center'>
                <thead>
                    <tr>
                        <th>Party</th>
                        <th>Seats</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </div>
    )
}

export default SainteLagueResultsTable;
