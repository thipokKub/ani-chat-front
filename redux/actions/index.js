import * as test_actions from './test_actions';
import * as map_actions from './map_actions';
import * as location_action from './location_action';
import * as chat_actions from './chat_actions';

const rootActions = {
    ...test_actions,
    ...map_actions,
    ...location_action,
    ...chat_actions
}

export default rootActions;