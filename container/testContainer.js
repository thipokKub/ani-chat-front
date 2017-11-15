import React from 'react';
import withStyle from '../hoc/withStyle';
import autoBind from '../hoc/autoBind';
import stylesheet from './style/testContainer.scss';

export default withStyle(autoBind((props) => {
    return (
        <div className="test-container" onClick={() => props.testMessage("Helloo")}>
            Store string: {props.test.String}
        </div>
    )
}), [stylesheet]);