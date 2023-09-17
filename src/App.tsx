import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import FaceSelector, {SelectableChris} from './components/FaceSelector';
import PollSelector from './components/PollSelector';

let chrises = Array<SelectableChris>();
chrises.push({key: "chris-right", alt: "face of Chris Luxon", image: "chris-right.png"});
chrises.push({key: "chris-left", alt: "face of Chris Hipkins", image: "chris-left.png"});

function App() {
  const [selectedChris, setSelectedChris] = useState('chris-right');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        <FaceSelector selectedChris={selectedChris} setSelectedChris={setSelectedChris} chrises={chrises}/>
      </header>
      <PollSelector/>
    </div>
  );
}

export default App;
