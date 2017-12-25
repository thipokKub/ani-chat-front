import Document, { Head, Main, NextScript } from 'next/document'
import stylesheet from '../constraint/variables.scss'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
    static getInitialProps({ renderPage }) {
        const sheet = new ServerStyleSheet()
        const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
        const styleTags = sheet.getStyleElement()
        return { ...page, styleTags }
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