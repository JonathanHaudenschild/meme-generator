import { LOGIN_USER, TOGGLE_SPEECH } from './action';

// Redux reducer to get state of signed in user & handle whether speech is active
const initialState = {
    user: { username: '', email: '', accessToken: '', isSignedIn: false },
    speech: {textToSpeechActive: false, speechToTextActive: false},
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload
            }
        case TOGGLE_SPEECH:
            return {
                ...state,
                speech: action.payload
            }
        default:
            return state;
    }
}

export default rootReducer;

