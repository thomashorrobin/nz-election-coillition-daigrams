import React, {useEffect, useState} from 'react';
import './App.css';
import PollSelector from './components/PollSelector';
import { fetchWikipediaPolls } from './lib/cheerio';
import { ScrappedPoll } from "./lib/ScrappedPoll";
import SainteLagueResultsTable from './components/SainteLague';
import VoteBar from './components/VoteBar';
import { calculateSeats } from './lib/sainte-lague';

function App() {
  const [polls, setPolls] = useState<ScrappedPoll[]>([])
  const [selectedPoll, setSelectedPoll] = useState<ScrappedPoll | null>(null);
  const [assumedMaoriSeats, setMaoriElectorateSeats] = useState<number>(3);
  const setSelectedPollHandler = (scrappedPoll: ScrappedPoll) => {
    setSelectedPoll(scrappedPoll);
  }
  const setMaoriElectorateSeatsHandler = (value: number) => {
    setMaoriElectorateSeats(value);
  }
  useEffect(() => {
    fetchWikipediaPolls().then(polls => {
        setPolls(polls)
        setSelectedPoll(polls[0])
    }).catch(err => {
        alert(err)
        window.close()
    });
}, [])
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Select poll and see potential coallition combinations
        </p>
        <a
          className="App-link"
          href="https://github.com/thomashorrobin/nz-election-coillition-daigrams"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source Code
        </a>
      </header>
      <main>
      <PollSelector polls={polls} maoriElectorateSeats={assumedMaoriSeats} setMaoriElectorateSeats={setMaoriElectorateSeatsHandler} setSelectedPoll={setSelectedPollHandler} selectedPoll={selectedPoll}/>
      {selectedPoll && <SelectedPollDetails selectedPoll={selectedPoll} assumedMaoriSeats={assumedMaoriSeats}/> }
      </main>
    </div>
  );
}

function SelectedPollDetails(props: {selectedPoll: ScrappedPoll, assumedMaoriSeats: number}): JSX.Element {
  const {selectedPoll, assumedMaoriSeats} = props;
  const parliamentComposition = calculateSeats(selectedPoll, assumedMaoriSeats);
  return (
    <div>
      <SainteLagueResultsTable parliamentComposition={parliamentComposition} selectedPoll={selectedPoll}/>
      <VoteBar results={parliamentComposition}/>
    </div>
  )
}

export default App;
