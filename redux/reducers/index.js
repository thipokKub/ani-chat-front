import { combineReducers } from 'redux';
import test_reducer from './test_reducer';
import map_reducer from './map_reducer';
import location_reducer from './location_reducer';
import chat_reducer from './chat_reducer';

const rootReducer = combineReducers({
    test: test_reducer,
    map: map_reducer,
    des: location_reducer,
    chat: chat_reducer
});

export default rootReducer;