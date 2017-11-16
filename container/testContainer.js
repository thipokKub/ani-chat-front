import React from 'react';
import withStyle from '../hoc/withStyle';
import autoBind from '../hoc/autoBind';
import withInternalState from '../hoc/withInternalState';
import stylesheet from './style/testContainer.scss';

function onAddOne(state) {
    return state.test + 1;
}

export default withInternalState(withStyle(autoBind((props) => {
    return (
        <div
            className="test-container"
            onClick={() => {
                props.testMessage("Helloo");
                props.onSetState('test', onAddOne(props.state))
            }}
        >
            Store string: {props.test.String}<br />
            Internal State string: {props.state.test}
        </div>
    )
}), [stylesheet]), {
    'test': 1
});