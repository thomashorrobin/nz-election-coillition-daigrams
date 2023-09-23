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
          Coalition Combinations
        </p>
        <span>
          <a
            className="App-link"
            href="https://github.com/thomashorrobin/nz-election-coillition-daigrams"
            target="_blank"
            rel="noopener noreferrer"
          >
            code
          </a> | <a
            className="App-link"
            href="https://en.wikipedia.org/wiki/Opinion_polling_for_the_2023_New_Zealand_general_election#Nationwide_polling"
            target="_blank"
            rel="noopener noreferrer"
          >data</a>
        </span>
      </header>
      <div>
      <PollSelector polls={polls} maoriElectorateSeats={assumedMaoriSeats} setMaoriElectorateSeats={setMaoriElectorateSeatsHandler} setSelectedPoll={setSelectedPollHandler} selectedPoll={selectedPoll}/>
      {selectedPoll && <SelectedPollDetails selectedPoll={selectedPoll} assumedMaoriSeats={assumedMaoriSeats}/> }
      </div>
    </div>
  );
}

function SelectedPollDetails(props: {selectedPoll: ScrappedPoll, assumedMaoriSeats: number}): JSX.Element {
  const {selectedPoll, assumedMaoriSeats} = props;
  const parliamentComposition = calculateSeats(selectedPoll, assumedMaoriSeats);
  return (
    <main>
      <SainteLagueResultsTable parliamentComposition={parliamentComposition} selectedPoll={selectedPoll}/>
      <VoteBar results={parliamentComposition}/>
    </main>
  )
}

export default App;
