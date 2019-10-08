const UPDATE_MELODY = 'UPDATE_MELODY';

const initialState = {
    notes: {
        violin_G3_05_forte: false, 
        violin_A3_05_forte: false, 
        violin_B3_05_forte: false, 
        violin_C4_05_forte: false, 
        violin_D4_05_forte: false,
        violin_E4_05_forte: false, 
        violin_F4_05_forte: false, 
        violin_G4_05_forte: false,
    },
};

export interface State {
    notes: object;
}

interface Action {
    type: string;
    payload: object;
}

export default function rootReducer(state: State = initialState, action: Action) {
    switch (action.type) {
        case UPDATE_MELODY:
            return {...state, notes: {...state.notes, ...action.payload}};
        default:
            return state;
    }
}
