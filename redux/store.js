import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { isDebug } from '../constraint/variables';
import rootReducer from './reducers/index';

const middlewares = [isDebug && logger, thunk].filter(Boolean);
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function iniitStore() {
    return createStoreWithMiddleware(rootReducer);
}