import React from 'react';
import { ScrappedPoll } from '../lib/ScrappedPoll';

function PollSelector(props: {setMaoriElectorateSeats: (value: number) => void, polls: ScrappedPoll[], selectedPoll: ScrappedPoll, setSelectedPoll: (scrappedPoll: ScrappedPoll) => void, maoriElectorateSeats: number}): JSX.Element {
    const {polls, selectedPoll, setMaoriElectorateSeats, maoriElectorateSeats} = props;
    const scrappedPolls = polls.map(scrappedPoll => <option className='text-sm' value={scrappedPoll.id.toString()} key={scrappedPoll.id.toString()}>{scrappedPoll.company} ({scrappedPoll.date})</option>)
    const handlePollChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPoll = polls.find(poll => poll.id.toString() == event.target.value);
        if (selectedPoll) {
            props.setSelectedPoll(selectedPoll);
            console.log(selectedPoll.id.toString());
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
        <div className='bg-gray-300 px-3 py-3'>
            <div className='flex flex-col'>
                <span className='mb-1'>Select Poll:</span>
                <select className='p-2 w-full rounded-md' id='poll-selector' onChange={handlePollChange} value={selectedPoll.id.toString()}>
                    {scrappedPolls}
                </select>
            </div>
            <div className='flex flex-col mt-4'>
                <label className='mb-1' htmlFor="maori-electorate-seat">Presumed Maori Electorate Seats:</label>
                <input className='p-2 rounded-md' onChange={handleMaoriElectorateSeatsChange} id='maori-electorate-seat' type="number" min={0} max={7} value={maoriElectorateSeats} />
            </div>
        </div>
    )
}

export default PollSelector;
