import React, { useCallback, useEffect, useState } from 'react';
import './PollSelector.css';
import { ScrappedPoll, fetchWikipediaPolls } from '../lib/cheerio';

function PollSelector(): JSX.Element {
    const [polls] = useState<ScrappedPoll[]>([{id: 2, date: '17th March', company: "roy morgan", results: new Map<string, number>()}, {id: 3, date: '13th March', company: "colmer brunton", results: new Map<string, number>()}])
    const scrappedPolls = polls.map(scrappedPoll => <option value={scrappedPoll.id} key={scrappedPoll.id}>{scrappedPoll.date} - {scrappedPoll.company}</option>)
    const [markdown, setMarkdown] = useState<string>('<p>Loading...</p>')
    useEffect(() => {
        fetchWikipediaPolls().then(text => {
            setMarkdown(text)
        })
    }, [])
    return (
        <div>
            <select className="PollSelector">
                {scrappedPolls}
            </select>
                <div dangerouslySetInnerHTML={{ __html: markdown }} />
        </div>
    )
}

export default PollSelector;
