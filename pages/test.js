import React from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import enhancedComponent from '../hoc/enhancedComponent';

const handleClickIndex = () => {
    setTimeout(() => {
        Router.push({
            pathname: '/'
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
    } catch (e) {
        console.log("Hi")
    }
}

export default enhancedComponent((props) => {
    return (
        <div>
            This is test page
            <br />
            Lol
            <br />
            <Link href="/">
                <a>Back to Index!</a>
            </Link>
            <button onClick={handleClickIndex}>Delay Redirect</button>
            <button onClick={handleClick}>Async Test</button>
        </div>
    );
}, {
        enableRedux: true,
        headOption: [{
            tag: 'title',
            content: 'test page'
        }]
    })