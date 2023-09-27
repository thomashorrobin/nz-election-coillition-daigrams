import React, {useEffect, useState} from 'react';
import './App.css';
import PollSelector from './components/PollSelector';
import { fetchWikipediaPolls } from './lib/cheerio';
import { ScrappedPoll } from "./lib/ScrappedPoll";
import SainteLagueResultsTable from './components/SainteLague';
import VoteBar from './components/VoteBar';
import { calculateSeats } from './lib/sainte-lague';
import { isSameUint8Array, getPollIDFromURL } from './lib/helpers';
import shareIcon from './share.svg';

function App() {
  const [polls, setPolls] = useState<ScrappedPoll[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    fetchWikipediaPolls().then(polls => {
        setPolls(polls);
    }).catch(err => {
        console.error(err);
        setError(err.message);
    });
}, [])
  return polls ? <SelectedPollController polls={polls}/> : error ? <AppError error={error}/> : <AppLoading/>
}

function findPollFromIdThrows(polls: ScrappedPoll[], pollID: Uint8Array): ScrappedPoll {
  const poll = polls.find(poll => isSameUint8Array(poll.id, pollID));
  if (poll) {
    return poll;
  } else {
    throw new Error(`Poll with id ${pollID} not found`);
  }
}

function SelectedPollController(props: {polls: ScrappedPoll[]}) {
  const {polls} = props;
  const searchParams = new URL(window.location.href).searchParams;
  const assumedMaoriSeatsURL = searchParams.get('assumed_maori_seats');
  const [assumedMaoriSeats, setMaoriElectorateSeats] = useState<number>(assumedMaoriSeatsURL ? parseInt(assumedMaoriSeatsURL) : 3);
  const pollIDURL = getPollIDFromURL(searchParams);
  const [pollID, setPollID] = useState<Uint8Array>(pollIDURL || polls[0].id);
  console.log(pollID);
  console.log(polls);
  const [selectedPoll, setSelectedPoll] = useState<ScrappedPoll>(findPollFromIdThrows(polls, pollID));

  useEffect(() => {
    setSelectedPoll(findPollFromIdThrows(polls, pollID));
  }, [pollID, polls])

  useEffect(() => {
    let u = new URL(window.location.href);
    let params = new URLSearchParams(u.search);
    params.set('assumed_maori_seats', assumedMaoriSeats.toString());
    params.set('poll_id', btoa(pollID.join(',')));
    u.search = params.toString();
    window.history.replaceState({}, '', u.toString());
  }, [pollID, assumedMaoriSeats])

  return (
    <div className="App">
      <Header selectedPoll={selectedPoll}/>
      <AppLoaded polls={polls} assumedMaoriSeats={assumedMaoriSeats} setMaoriElectorateSeats={setMaoriElectorateSeats} setPollID={setPollID} selectedPoll={selectedPoll}/>
    </div>
  )
}

function AppError(props: {error: string}) {
  return (
    <div className="App-error">
      <h2>Something went wrong</h2>
      <p>{props.error}</p>
    </div>
  )
}

function AppLoading() {
  return (
    <div className="App-loading">
      <p>Loading...</p>
    </div>
  )
}

function Header(props: {selectedPoll: ScrappedPoll}) {
  const {selectedPoll} = props;
  function share() {
    const shareData = {
    title: `${selectedPoll.company} (${selectedPoll.date})`,
    url: window.location.href,
  };
  navigator.share(shareData).catch((err) => {
    console.log(`Error: ${err}`);
  });
}
  return (
    <header className="App-header">
      <div className='App-header-centre'>
      <div></div>
      <div>
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
      </div>
      <div className='share-icon'>
        <img src={shareIcon} alt="share" onClick={share}/>
      </div>
      </div>
    </header>
  )
}

function AppLoaded(props: {polls: ScrappedPoll[], assumedMaoriSeats: number, setMaoriElectorateSeats: (value: number) => void, setPollID: (value: Uint8Array) => void, selectedPoll: ScrappedPoll}) {
  const {polls, assumedMaoriSeats, setMaoriElectorateSeats, setPollID, selectedPoll} = props;
  const setSelectedPollHandler = (scrappedPoll: ScrappedPoll) => {
    setPollID(scrappedPoll.id);
    }
  const setMaoriElectorateSeatsHandler = (value: number) => {
    setMaoriElectorateSeats(value);
  }
  return (
      <div>
      <PollSelector polls={polls} maoriElectorateSeats={assumedMaoriSeats} setMaoriElectorateSeats={setMaoriElectorateSeatsHandler} setSelectedPoll={setSelectedPollHandler} selectedPoll={selectedPoll}/>
      <SelectedPollDetails selectedPoll={selectedPoll} assumedMaoriSeats={assumedMaoriSeats}/>
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
