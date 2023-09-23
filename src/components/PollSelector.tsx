import React from 'react';
import './PollSelector.css';
import { ScrappedPoll } from '../lib/ScrappedPoll';

function PollSelector(props: {setMaoriElectorateSeats: (value: number) => void, polls: ScrappedPoll[], selectedPoll: ScrappedPoll | null, setSelectedPoll: (scrappedPoll: ScrappedPoll) => void, maoriElectorateSeats: number}): JSX.Element {
    const {polls, selectedPoll, setMaoriElectorateSeats, maoriElectorateSeats} = props;
    const scrappedPolls = polls.map(scrappedPoll => <option value={scrappedPoll.id} key={scrappedPoll.id}>{scrappedPoll.company} - {scrappedPoll.date}</option>)
    const handlePollChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPoll = polls.find(poll => poll.id === parseInt(event.target.value));
        if (selectedPoll) {
            props.setSelectedPoll(selectedPoll);
        } else {
            alert("Poll not found");
        }
    }
    const handleMaoriElectorateSeatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (value >= 0 && value <= 7) {
            setMaoriElectorateSeats(value);
        }
    }
    return (
        <div className='poll-selector-container'>
            <select id='poll-selector' onChange={handlePollChange} value={selectedPoll ? selectedPoll.id : 1}>
                {scrappedPolls}
            </select>
            <div className='maori-electorate-seat-layout'>
                <label htmlFor="maori-electorate-seat">Presumed Maori Electorate Seats:</label>
                <input onChange={handleMaoriElectorateSeatsChange} id='maori-electorate-seat' type="number" min={0} max={7} value={maoriElectorateSeats} />
            </div>
        </div>
    )
}

export default PollSelector;
