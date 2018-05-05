import * as types from '../types';

export function createChat(id, dataStack) {
    return ({
        type: types.CREATE_CHAT,
        payload: {
            id: id,
            data: dataStack
        }
    })
}

export function updateCoreChat(id, dataStack) {
    return ({
        type: types.CREATE_CHAT,
        payload: {
            id: id,
            data: dataStack
        }
    })
}

export function updateChat(id, newDataStack) {
    if(newDataStack.constructor !== Array) {
        newDataStack = [newDataStack];
    }
    return ({
        type: types.UPDATE_CHAT,
        payload: {
            id: id,
            data: newDataStack
        }
    })
}