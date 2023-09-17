import React from 'react';
import './PollSelector.css';
import { ScrappedPoll } from '../lib/cheerio';

function PollSelector(props: {polls: ScrappedPoll[], selectedPoll: ScrappedPoll | null, setSelectedPoll: (scrappedPoll: ScrappedPoll) => void}): JSX.Element {
    const {polls, selectedPoll} = props;
    const scrappedPolls = polls.map(scrappedPoll => <option value={scrappedPoll.id} key={scrappedPoll.id}>{scrappedPoll.date} - {scrappedPoll.company}</option>)
    const handlePollChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPoll = polls.find(poll => poll.id === parseInt(event.target.value));
        if (selectedPoll) {
            props.setSelectedPoll(selectedPoll);
        } else {
            alert("Poll not found");
        }
    }
    return (
        <div>
            <select onChange={handlePollChange} className="PollSelector" value={selectedPoll ? selectedPoll.id : 1}>
                {scrappedPolls}
            </select>
        </div>
    )
}

export default PollSelector;
