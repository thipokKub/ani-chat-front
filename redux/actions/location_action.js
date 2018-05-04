import * as types from '../types';

export function updateLocation(location) {
    return ({
        type: types.UPDATE_LOCATION,
        payload: location
    })
}