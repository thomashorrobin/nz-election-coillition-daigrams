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

function findPollFromIdDefaults(polls: ScrappedPoll[], pollID: Uint8Array): ScrappedPoll {
  const poll = polls.find(poll => isSameUint8Array(poll.id, pollID));
  if (poll) {
    return poll;
  } else {
    return polls[0];
  }
}

function assumedMaoriSeatsURLOrDefault(searchParams: URLSearchParams): number {
  const assumedMaoriSeatsURL = searchParams.get('assumed_maori_seats');
  if (!assumedMaoriSeatsURL) {
    return 1;
  }
  const assumedMaoriSeats = parseInt(assumedMaoriSeatsURL);
  if (isNaN(assumedMaoriSeats)) {
    return 1;
  }
  return assumedMaoriSeats;
}

function SelectedPollController(props: {polls: ScrappedPoll[]}) {
  const {polls} = props;
  const searchParams = new URL(window.location.href).searchParams;
  const [assumedMaoriSeats, setMaoriElectorateSeats] = useState<number>(assumedMaoriSeatsURLOrDefault(searchParams));
  const pollIDURL = getPollIDFromURL(searchParams);
  const [pollID, setPollID] = useState<Uint8Array>(pollIDURL || polls[0].id);
  console.log(pollID);
  console.log(polls);
  const [selectedPoll, setSelectedPoll] = useState<ScrappedPoll>(findPollFromIdDefaults(polls, pollID));

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
    <div className="pb-5.0">
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
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
    <img
      src="https://images.unsplash.com/photo-1657673601370-a6e28b4b8e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
      alt=""
      className="absolute inset-0 -z-10 h-full w-full object-cover"
    />
    <div
      className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      aria-hidden="true"
    >
      <div
        className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
    <div
      className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
      aria-hidden="true"
    >
      <div
        className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        style={{
          clipPath:
            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
        }}
      />
    </div>
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">NZ Election</h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Possible Coalition Combinations based on recent polls
        </p>
        <a
          href="https://github.com/thomashorrobin/nz-election-coillition-daigrams"
          target="_blank"
        >
          <button
            className="mt-6 text-lg leading-8 text-gray-300"
            rel="noopener noreferrer">
              View Code on Github 
              <span aria-hidden="true">&rarr;</span>
          </button>
        </a>
        <a
          href="https://en.wikipedia.org/wiki/Opinion_polling_for_the_2023_New_Zealand_general_election#Nationwide_polling"
          target="_blank"
        >
          <button
            className="mt-6 ml-8 text-lg leading-8 text-gray-300"
            rel="noopener noreferrer">
              View Data
              <span aria-hidden="true">&rarr;</span>
          </button>
        </a>
      <div className='share-icon mt-6 flex'>
        <img src={shareIcon} alt="share" onClick={share}/>
        <span className='text-white ml-4 mt-1'>Share this site</span>
      </div>
      </div>
    </div>
  </div>
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
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-7xl lg:mx-0">
        <PollSelector polls={polls} maoriElectorateSeats={assumedMaoriSeats} setMaoriElectorateSeats={setMaoriElectorateSeatsHandler} setSelectedPoll={setSelectedPollHandler} selectedPoll={selectedPoll}/>
        <SelectedPollDetails selectedPoll={selectedPoll} assumedMaoriSeats={assumedMaoriSeats}/>
      </div>
    </div>
  );
}

function SelectedPollDetails(props: {selectedPoll: ScrappedPoll, assumedMaoriSeats: number}): JSX.Element {
  const {selectedPoll, assumedMaoriSeats} = props;
  const parliamentComposition = calculateSeats(selectedPoll, assumedMaoriSeats);
  return (
    <main>
      <div className="flex flex-col md:flex-row bg-gray-100 p-3">
        <SainteLagueResultsTable parliamentComposition={parliamentComposition} selectedPoll={selectedPoll}/>
        <VoteBar results={parliamentComposition}/>
      </div>
    </main>
  )
}

export default App;
