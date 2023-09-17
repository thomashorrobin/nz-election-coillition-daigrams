import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './PollSelector.css';
import { ScrappedPoll, fetchWikipediaPolls } from '../lib/cheerio';

function PollSelector(): JSX.Element {
    const [polls, setPolls] = useState<ScrappedPoll[]>([])
    const scrappedPolls = polls.map(scrappedPoll => <option value={scrappedPoll.id} key={scrappedPoll.id}>{scrappedPoll.date} - {scrappedPoll.company}</option>)
    useEffect(() => {
        fetchWikipediaPolls().then(polls => {
            setPolls(polls)
        }).catch(err => {
            alert(err)
            window.close()
        });
    }, [])
    return (
        <div>
            <select className="PollSelector">
                {scrappedPolls}
            </select>
        </div>
    )
}

export default PollSelector;
