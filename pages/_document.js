import Document, { Head, Main, NextScript } from 'next/document'
import stylesheet from '../constraint/variables.scss'
import generalStylesheet from './style/general.min.css';
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
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
                    <style dangerouslySetInnerHTML={{ __html: generalStylesheet }} />
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}