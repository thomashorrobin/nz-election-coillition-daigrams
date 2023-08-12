import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import FaceSelector, {SelectableChris} from './components/FaceSelector';

function App() {
  const [selectedChris, setSelectedChris] = useState('chris-right');
  let chrises = Array<SelectableChris>();
  chrises.push({key: "chris-right", alt: "face of Chris Luxon", image: "chris-right.png"});
  chrises.push({key: "chris-left", alt: "face of Chris Hipkins", image: "chris-left.png"});
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <FaceSelector selectedChris={selectedChris} setSelectedChris={setSelectedChris} chrises={chrises}/>
    </div>
  );
}

export default App;
