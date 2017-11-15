import React from 'react';
import pageConnect from '../hoc/pageConnect';
import dynamic from 'next/dynamic';
const Link = dynamic(import('next/link'))

export default pageConnect((props) => {
    return (
        <div>
            This is about page
            <Link href="/index">
                <a>Click Me!</a>
            </Link>
            <button onClick={() => props.testMessage("Hello")}>Click</button>
        </div>
    );
});