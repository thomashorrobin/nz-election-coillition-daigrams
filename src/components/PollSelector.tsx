import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './PollSelector.css';
import { ScrappedPoll, fetchWikipediaPolls } from '../lib/cheerio';

function PollSelector(props: {polls: ScrappedPoll[]}): JSX.Element {
    const {polls} = props;
    const scrappedPolls = polls.map(scrappedPoll => <option value={scrappedPoll.id} key={scrappedPoll.id}>{scrappedPoll.date} - {scrappedPoll.company}</option>)
    return (
        <div>
            <select className="PollSelector">
                {scrappedPolls}
            </select>
        </div>
    )
}

export default PollSelector;
