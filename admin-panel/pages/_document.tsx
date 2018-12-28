import Document, { Head, Main, NextScript } from 'next/document'

class ContentAdminDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                </Head>
                <body>
                    <Main />
                    <NextScript/>
                </body>
            </html>
        )
    }
}

export default ContentAdminDocument;