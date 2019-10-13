const UPDATE_MELODY = 'UPDATE_MELODY';

const initialState = {
    notes: [],
    x: 8,
    y: 20
};

for (let i = 0; i < initialState.y; i++) {
    const temp = [];
    for (let j = 0; j < initialState.x; j++) {
        temp.push(false);
    }
    initialState.notes.push(temp);
}

export interface State {
    notes: boolean[][];
    x: number;
    y: number;
}

interface Action {
    type: string;
    payload: {yPos: number, xPos: number, toPlay: boolean}; //y position is a place in the melody, x position is a note
}

export default function rootReducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case 'UPDATE_MELODY':
            const {yPos, xPos, toPlay} = action.payload;
            const temp = [...state.notes];
            temp[yPos] = [...temp[yPos]];
            temp[yPos][xPos] = toPlay;
            return {...state, notes: [...temp]};
        default:
            return state;
    }
}
