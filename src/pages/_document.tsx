import Document, {Html, Head, Main, NextScript} from 'next/document';

export default class MyDocument extends Document {
    render() {
        return(
            <Html lang="en">
                <Head>
                    <meta name="author" content="Navar Kartalian" />
                    <meta name="description" content="Medium clone" />
                    <link rel="shortcut icon" href="/favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}