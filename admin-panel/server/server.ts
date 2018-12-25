import * as next from 'next';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler();

export async function createServer() {
    await nextApp.prepare();

    const app = express();
    app.use(bodyParser.json())
    app.use(express.static('static'))

    // deletgate to next handler
    app.get('*', (req, res) => {
        const parsedUrl = parse(req.url, true)
        // const { pathname, query } = parsedUrl

        return handle(req, res, parsedUrl)
    })

    return app;
}