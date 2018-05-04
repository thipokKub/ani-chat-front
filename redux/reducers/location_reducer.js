import * as types from '../types';

const initialState = {
    'location': 'http://localhost:3001'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.UPDATE_LOCATION:
            return {
                ...state,
                'location': action.payload
            }
        default:
            return {
                ...state
            }
    }
}