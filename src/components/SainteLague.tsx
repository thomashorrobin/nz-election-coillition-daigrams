import React, { useEffect, useState } from 'react';
import './SainteLague.css';
import { ScrappedPoll } from '../lib/ScrappedPoll';

function parlimentToRows(parliment: Map<string, number>): JSX.Element[] {
    const tableRows = new Array<JSX.Element>();
    parliment.forEach((value, key) => {
        tableRows.push(<tr key={key}><td>{key}</td><td>{value}</td></tr>)
    });
    return tableRows;
}

function SainteLagueResultsTable(props:{parliamentComposition: Map<string, number>, selectedPoll: ScrappedPoll}): JSX.Element {
    const {parliamentComposition, selectedPoll} = props;
    const tableRows = parlimentToRows(parliamentComposition);
    return (
        <div>
            <table className='table-center'>
                <thead>
                    <tr>
                        <th colSpan={2}>{selectedPoll.company}<br/><small>{selectedPoll.date}</small></th>
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
