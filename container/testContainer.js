import React from 'react';
import withStyle from '../hoc/withStyle';
import autoBind from '../hoc/autoBind';
import withInternalState from '../hoc/withInternalState';
import normalComponent from '../hoc/normalComponent';
import stylesheet from './style/testContainer.scss';

function onAddOne(state) {
    return state.test + 1;
}

export default normalComponent(autoBind((props) => {
    return (
        <div
            className="test-container"
            onClick={() => {
                props.testMessage("Helloo");
                props.onSetState('test', onAddOne(props.state));
            }}
        >
            Store string: {props.test.String}<br />
            Internal State string: {props.state.test}
        </div>
    )
}), {
    initialState: {
        'test': 1
    },
    onError: (error, info) => console.log(error, info),
    fallbackJSX: <div>Hello, this is error message</div>,
    stylesheets: [stylesheet]
});