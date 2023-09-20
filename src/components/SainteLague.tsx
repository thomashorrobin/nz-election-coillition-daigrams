import React, { useEffect, useState } from 'react';
import './SainteLague.css';
import { ScrappedPoll } from '../lib/ScrappedPoll';
import { calculateSeats } from '../lib/sainte-lague';

function parlimentToRows(parliment: Map<string, number>): JSX.Element[] {
    const tableRows = new Array<JSX.Element>();
    parliment.forEach((value, key) => {
        tableRows.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>)
    });
    return tableRows;
}

function SainteLagueResultsTable(props:{selectedPoll: ScrappedPoll | null, maoriElectorateSeats: number}): JSX.Element {
    const {selectedPoll, maoriElectorateSeats} = props;
    const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
    useEffect(() => {
        if (!selectedPoll) {
            return;
        }
        const parliament = calculateSeats(selectedPoll, maoriElectorateSeats);
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
