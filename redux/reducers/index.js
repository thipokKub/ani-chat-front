import { combineReducers } from 'redux';
import test_reducer from './test_reducer';

const rootReducer = combineReducers({
    test: test_reducer
});

export default rootReducer;