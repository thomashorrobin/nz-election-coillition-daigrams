import React from 'react';
import './FaceSelector.css';

export type SelectableChris = {
  key: string,
  alt: string,
  image: string,
};

// function FaceSelector(props: {selectedChris: string, chrises: string[]}): JSX.Element {
  function FaceSelector(props: {selectedChris: string, setSelectedChris: (chris:string) => void, chrises: Array<SelectableChris>}): JSX.Element {
    let chrisesList = props.chrises.map((chris) => <img onClick={() => props.setSelectedChris(chris.key)} className={ chris.key === props.selectedChris ? 'selected' : ''} key={chris.key} src={chris.image} alt={chris.alt} />);
  return (
    <div className="FaceSelectorScrollView">
      <div className="FaceSelector">
        {chrisesList}
      </div>
  </div>
  );
}

export default FaceSelector;