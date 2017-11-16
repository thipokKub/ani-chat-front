import React, { Component } from 'react';
import pageConnect from '../hoc/pageConnect';
import _ from 'lodash';

/**
 * Source reference will be kept in redux store
 * Internal state only kept the reference of that (to be able to globally updated)
 */
class FormTest extends Component {

    render() {
        /* Calculate property that will be used to rendered - dependent on props */
        const formId = _.get(this.props, 'formId', 'No Id');

        /* Rendered JSX */
        return (
            <div>
                {formId}
            </div>
        )
    }
}

export default pageConnect(FormTest, {
    title: 'form'
});