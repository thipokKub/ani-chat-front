import * as types from '../types';

const initialState = {}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.CREATE_CHAT:
            return {
                ...state,
                [action.payload.id]: action.payload.data
            }
        case types.UPDATE_CHAT:
            return {
                ...state,
                [action.payload.id]: state[action.payload.id].concat(action.payload.data)
            }
        default:
            return {
                ...state
            }
    }
}