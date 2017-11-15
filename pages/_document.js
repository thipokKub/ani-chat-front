import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import stylesheet from '../constraint/variables.scss';

export default class MyDocument extends Document {
    static getInitialProps({ renderPage }) {
        const { html, head, errorHtml, chunks } = renderPage()
        const styles = flush()
        return { html, head, errorHtml, chunks, styles }
    }

    render() {
        // const { nextStyle } = props;

        return (
            <html>
                <Head>
                    <title>My page</title>
                    <link rel='stylesheet' type='text/css' href='/static/resources/nprogress.css' />
                    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}