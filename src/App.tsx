import React, {useEffect, useState} from 'react';
// import logo from './logo.svg';
import './App.css';
// import FaceSelector, {SelectableChris} from './components/FaceSelector';
import PollSelector from './components/PollSelector';
import { fetchWikipediaPolls } from './lib/cheerio';
import { ScrappedPoll } from "./lib/ScrappedPoll";
import SainteLagueResultsTable from './components/SainteLague';

// let chrises = Array<SelectableChris>();
// chrises.push({key: "chris-right", alt: "face of Chris Luxon", image: "chris-right.png"});
// chrises.push({key: "chris-left", alt: "face of Chris Hipkins", image: "chris-left.png"});

function App() {
  // const [selectedChris, setSelectedChris] = useState('chris-right');
  const [polls, setPolls] = useState<ScrappedPoll[]>([])
  const [selectedPoll, setSelectedPoll] = useState<ScrappedPoll | null>(null);
  const [maoriElectorateSeats, setMaoriElectorateSeats] = useState<number>(3);
  const setSelectedPollHandler = (scrappedPoll: ScrappedPoll) => {
    setSelectedPoll(scrappedPoll);
  }
  const setMaoriElectorateSeatsHandler = (value: number) => {
    console.log(value);
    setMaoriElectorateSeats(value);
  }
  useEffect(() => {
    fetchWikipediaPolls().then(polls => {
        setPolls(polls)
    }).catch(err => {
        alert(err)
        window.close()
    });
}, [])
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
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
        {/* <FaceSelector selectedChris={selectedChris} setSelectedChris={setSelectedChris} chrises={chrises}/> */}
      </header>
      <main>
      <PollSelector polls={polls} maoriElectorateSeats={maoriElectorateSeats} setMaoriElectorateSeats={setMaoriElectorateSeatsHandler} setSelectedPoll={setSelectedPollHandler} selectedPoll={selectedPoll}/>
      <SainteLagueResultsTable selectedPoll={selectedPoll} maoriElectorateSeats={maoriElectorateSeats}/>
      </main>
    </div>
  );
}

export default App;
