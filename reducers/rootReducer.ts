const UPDATE_MELODY = 'UPDATE_MELODY';
const CLEAR_MELODY = 'CLEAR_MELODY';
const CHANGE_INSTRUMENT = 'CHANGE_INSTRUMENT';
const RANDOM_MELODY = 'RANDOM_MELODY';
const SELECT_INSTRUMENT_FOR_RANDOM_MELODY = 'SELECT_INSTRUMENT_FOR_RANDOM_MELODY';

const initialState = {
    notes: [],
    x: 8,
    y: 24,
    instrument: 'violin',
    random_instruments: {violin: true, flute: true, contrabassoon: false, clarinet: true},
};

for (let i = 0; i < initialState.y; i++) {
    const temp = [];
    for (let j = 0; j < initialState.x; j++) {
        temp.push('none');
    }
    initialState.notes.push(temp);
}

export interface State {
    notes: string[][];
    x: number;
    y: number;
    instrument: string;
    random_instruments: object,
}

interface Action {
    type: string;
    payload: {
        yPos: number, 
        xPos: number, //y position is a place in the melody, x position is a note
        instrumentToPlay: string, 
        instrumentToSelect: string,
        newNotes: string[][],
        randomInstrumentToChange: string,
    };
}

export default function rootReducer(state: State = initialState, action: Action) { //to change cases to make deep copies instead of shallow ones
    switch (action.type) {
        case UPDATE_MELODY:
            const {yPos, xPos, instrumentToPlay} = action.payload;
            const temp = [...state.notes];
            temp[yPos] = [...temp[yPos]];
            temp[yPos][xPos] = instrumentToPlay;
            return {...state, notes: [...temp]}; //maybe the second spreading is excessive
        case CLEAR_MELODY:
            return {...initialState, notes: [...initialState.notes]};
        case CHANGE_INSTRUMENT:
            const {instrumentToSelect} = action.payload;
            return {...state, notes: [...state.notes], instrument: instrumentToSelect};
        case RANDOM_MELODY:
            const {newNotes} = action.payload;
            return {...state, notes: [...newNotes]};
        case SELECT_INSTRUMENT_FOR_RANDOM_MELODY:
            const {randomInstrumentToChange} = action.payload;
            const temp2 = {...state.random_instruments};
            temp2[randomInstrumentToChange] = temp2[randomInstrumentToChange] ? false : true;
            return {...state, random_instruments: {...temp2}}; //maybe the second spreading is excessive
        default:
            return state;
    }
}
