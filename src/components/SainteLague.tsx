import React, { useEffect, useState } from 'react';
import './SainteLague.css';

function parlimentToRows(parliment: Map<string, number>): JSX.Element[] {
    const tableRows = new Array<JSX.Element>();
    parliment.forEach((value, key) => {
        tableRows.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>)
    });
    return tableRows;
}

function SainteLagueResultsTable(props:{parliamentComposition: Map<string, number> | null}): JSX.Element {
    const {parliamentComposition} = props;
    const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
    useEffect(() => {
        if (!parliamentComposition) {
            return;
        }
        setTableRows(parlimentToRows(parliamentComposition));
    }, [parliamentComposition])
    if (!parliamentComposition) {
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
