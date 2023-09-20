import './VoteBar.css';

function getLogoPath(partyName: string): string {
    const partyLogoMapper = new Map<string, string>([
        ['Labour', 'labour-party-logo-june-2016'],
        ['National', 'national-party-logo-june-2017'],
        ['Greens', 'green-party-logo-june-2017'],
        ['ACT', 'the-act-party-logo-august-2019'],
        ['Maori Party', 'maori-party-logo-june-2017'],
        ['NZ First', 'nz-first-logo-june-2017'],
    ]);
    const fileName = partyLogoMapper.get(partyName);
    if (fileName) {
        return `logos/${fileName}.jpg`;
    }
    throw new Error(`No logo found for party ${partyName}`);
}

function VoteBarItem(props:{name:string, votes:number}): JSX.Element {
    return (
        <div className='vote-bar-item'>
            <img src={getLogoPath(props.name)} alt={props.name} />
            <div><span>{props.votes}</span></div>
        </div>
    )
}

function addSeats(results: Map<string, number>): number {
    return Array.from(results.values()).reduce((a, b) => a + b, 0);
}

function calculateSeatsToWin(results: Map<string, number>): number {
    const totalSeats = addSeats(results);
    return Math.floor(totalSeats / 2) + 1;
}

function VoteBar(props:{results: Map<string, number>, seatsToWin: number}): JSX.Element {
    const {results, seatsToWin} = props;
    const voteBarItems = new Array<JSX.Element>();
    results.forEach((value, key) => {
        voteBarItems.push(<VoteBarItem name={key} votes={value} key={key} />);
    });
    const totalSeats = addSeats(results);
    return (
        <div className="vote-bar">
            <div className='vote-bar-items'>
                {voteBarItems}
            </div>
            <div className={totalSeats < seatsToWin ? "vote-bar-total" : "vote-bar-total-win"}><span>{totalSeats}</span></div>
        </div>
    )
}

function VoteBarContainer(props:{results: Map<string, number>}): JSX.Element {
    const {results} = props;
    console.log(addSeats(results));
    const seatsToWin = calculateSeatsToWin(results);
    console.log(seatsToWin);
    const rightWingCoilition = new Map<string, number>();
    rightWingCoilition.set('ACT', results.get('ACT') || 0);
    rightWingCoilition.set('National', results.get('National') || 0);
    // rightWingCoilition.set('NZ First', results.get('NZ First') || 0);
    const leftWingCoilition = new Map<string, number>();
    leftWingCoilition.set('Greens', results.get('Greens') || 0);
    leftWingCoilition.set('Labour', results.get('Labour') || 0);
    leftWingCoilition.set('Maori Party', results.get('Maori Party') || 0);
    // leftWingCoilition.set('NZ First', results.get('NZ First') || 0);
    return (
        <div>
            <VoteBar results={rightWingCoilition} seatsToWin={seatsToWin}/>
            <VoteBar results={leftWingCoilition} seatsToWin={seatsToWin}/>
        </div>
    )
}

export default VoteBarContainer;
