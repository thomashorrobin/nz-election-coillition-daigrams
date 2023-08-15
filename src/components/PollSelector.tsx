import React, { useCallback } from 'react';
import './PollSelector.css';
import { fetchWikipediaPolls } from '../lib/cheerio';

function PollSelector(): JSX.Element {
    const scrappedPolls = useCallback(fetchWikipediaPolls, [])().map(scrappedPoll => <option value={scrappedPoll.id}>{scrappedPoll.date} - {scrappedPoll.company}</option>)
    return (
        <select className="PollSelector">
            {scrappedPolls}
        </select>
    )
}

export default PollSelector;
