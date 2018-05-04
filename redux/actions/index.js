import * as test_actions from './test_actions';
import * as map_actions from './map_actions';
import * as location_action from './location_action';

const rootActions = {
    ...test_actions,
    ...map_actions,
    ...location_action
}

export default rootActions;