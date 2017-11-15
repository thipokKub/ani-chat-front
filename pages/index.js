import React from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import pageConnect from '../hoc/pageConnect';

const handleClickIndex = () => {
    setTimeout(() => {
        Router.push({
            pathname: '/about'
        });
    }, 500);
}

const handleClick = () => {
    test();
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));;
}

async function test() {
    try {
        await wait(700);
        console.log("Hello")
    } catch(e) {
        console.log("Hi")
    }
}

export default pageConnect((props) => {
    return (
        <div>
            <Head>
                <title>Index</title>
            </Head>
            This is index page
            <br />
            Lol
            <br />
            <Link href="/about">
                <a>Click Me!</a>
            </Link>
            <button onClick={handleClickIndex}>Delay Redirect</button>
            <button onClick={handleClick}>Async Test</button>
        </div>
    );
}, {
    title: 'Index'
})