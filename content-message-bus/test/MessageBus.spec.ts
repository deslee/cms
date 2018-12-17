import 'mocha'
import { MessageBus } from '../MessageBus';
import assert = require('assert');
import * as winston from 'winston'
import { createLogger, ApplicationLogger } from 'content-logs';

type WaitEchoRequest = {
    waitMs: number,
    echo: string
}

type WaitEchoResponse = {
    error?: Error
    result: string
};

class Echoer {
    waiter(millis): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, millis))
    }

    async waitEcho(request: WaitEchoRequest): Promise<WaitEchoResponse> {
        await this.waiter(request.waitMs);
        return {
            result: request.echo
        };
    }
}

const logger = createLogger({
    logFile: 'test.dev.log',
    mongoUrl: null,
    context: {
        serviceName: 'MessageBusTests',
        environment: 'unittest'
    }
});

describe('Message Bus', function() {
    const subject = 'foo'
    const messageBus = new MessageBus({
        nats: {}
    }, logger)
    const echoer = new Echoer()
    
    this.beforeAll(function() {
        messageBus.connect();
    })
    
    it('should create a subscription', async function() {
        const sid = messageBus.subscribe<WaitEchoRequest>(subject, echoer.waitEcho.bind(echoer))
        assert(sid)
    })

    it('should be able to make a request / response', async function() {
        const waitAndEcho = {
            waitMs: 0,
            echo: 'Hello world!'
        };
        const response = await messageBus.request<WaitEchoRequest, WaitEchoResponse>(subject, waitAndEcho, 1000);
        assert.strictEqual(response.result, waitAndEcho.echo)
    })

    this.afterAll(function() {
        messageBus.close();
    })
})