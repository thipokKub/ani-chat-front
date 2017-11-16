import React from 'react';
import pageConnect from '../hoc/pageConnect';
import stylesheet from './style/parallax.scss';
import TestContainer from '../container/testContainer';
import Link from 'next/link';
import OutsideClick from '../component/OutsideClick';

export default pageConnect((props) => {
    return (
        <div className="parallax-page">
            This is parallax page
            <OutsideClick
                onClickOutside={() => console.log("You clicked outside")}
                style={{
                    display: 'block'
                }}
            >
                <TestContainer />
            </OutsideClick>
            <Link href="/">
                <a>Click Me!</a>
            </Link>
        </div>
    );
}, {
    stylesheets: [stylesheet],
    title: 'Parallax'
});