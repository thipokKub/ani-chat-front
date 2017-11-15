import React from 'react';
import pageConnect from '../hoc/pageConnect';
import stylesheet from './style/parallax.scss';
import withStyle from '../hoc/withStyle';
import TestContainer from '../container/testContainer';
import Link from 'next/link';

export default pageConnect((props) => {
    return (
        <div className="parallax-page">
            This is parallax page
            <TestContainer />
            <Link href="/">
                <a>Click Me!</a>
            </Link>
        </div>
    );
}, {
    stylesheets: [stylesheet],
    title: 'Parallax'
});