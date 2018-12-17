import * as NATS from 'nats'
import { ApplicationLogger } from 'content-logs'

export interface MessageBusOptions {
    nats: NATS.ClientOpts
}

export class MessageBus {
    nats: NATS.Client;
    options: MessageBusOptions;
    logger: ApplicationLogger;
    constructor(options: MessageBusOptions, logger: ApplicationLogger) {
        this.options = options;
        this.logger = logger;
    }

    connect() {
        if (!this.nats) {
            this.nats = NATS.connect(this.options.nats)
        }
    }

    close() {
        if (this.nats) {
            this.nats.close();
            this.nats = null;
        }
    }

    request<TRequest, TResponse>(subject: string, message: TRequest, timeoutMillis: number): Promise<TResponse> {
        return new Promise((resolve, reject) => {
            this.logger.info('NATS request', { methodName: 'Messagebus.request' })
            try {
                this.nats.requestOne(subject, JSON.stringify(message), {}, timeoutMillis, (response) => {
                    this.logger.info('NATS response', { methodName: 'Messagebus.request' })
                    if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
                        reject('Request timed out.');
                        return;
                    }
                    var dataResponse = JSON.parse(response)
                    if (dataResponse && dataResponse.messageBusError) {
                        reject(dataResponse.messageBusError)
                    }
                    resolve(dataResponse)
                })
            } catch (error) {
                this.logger.error(`NATS error while calling requestOne: ${error}`, { methodName: 'Messagebus.request', error: error })
                reject(error)
            }
        })
    }

    subscribe<TResponse>(subject: string, callback: (response: TResponse) => any): number {
        return this.nats.subscribe(subject, (message, replyTo) => {
            var request = JSON.parse(message)
            try {
                var response = callback(request)
                if (response) {
                    if (response.then) {
                        response.then(actualResponse => {
                            if (replyTo) {
                                this.nats.publish(replyTo, JSON.stringify(actualResponse))
                            }
                        }).catch(error => {
                            if (replyTo) {
                                this.nats.publish(replyTo, JSON.stringify({
                                    messageBusError: error
                                }))
                            }
                        })
                    } else {
                        if (replyTo) {
                            this.nats.publish(replyTo, JSON.stringify(response))
                        }
                    }
                }
            } catch (error) {
                if (replyTo) {
                    this.nats.publish(replyTo, JSON.stringify({
                        messageBusError: error
                    }))
                }
            }
        })
    }

    unsubscribe(sid: number) {
        this.nats.unsubscribe(sid)
    }
}