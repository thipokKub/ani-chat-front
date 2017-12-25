import React, { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router'
import Head from 'next/head';
import enhancedComponent from '../hoc/enhancedComponent';
import stylesheet from './style/index.scss';
import { Button } from '../component';

const handleClickIndex = () => {
    setTimeout(() => {
        Router.push({
            pathname: '/test'
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

class Index extends Component {
    render() {
        const props = this.porps;

        return (
            <div className="index-page">
                This is index page
                <br />
                Lol
                <br />
                <Link href="/test">
                    <a>Go to test!</a>
                </Link>
                <Button
                    outline
                    onClick={handleClickIndex}
                >
                    Delay Redirect
                </Button>
                <button onClick={handleClick}>Async Test</button>
            </div>
        );
    }
}

export default enhancedComponent(Index, {
    enableRedux: true,
    headOption: [{
        tag: 'title',
        content: 'index page'
    }],
    styleUrls: [stylesheet]
})