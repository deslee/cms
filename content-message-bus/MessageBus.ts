import * as NATS from 'nats'

export interface MessageBusOptions {
    nats: NATS.ClientOpts
}

export class MessageBus {
    nats: NATS.Client;
    options: MessageBusOptions;
    constructor(options: MessageBusOptions) {
        this.options = options;
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
            this.nats.requestOne(subject, JSON.stringify(message), {}, timeoutMillis, function (response) {
                if (response instanceof NATS.NatsError && response.code === NATS.REQ_TIMEOUT) {
                    reject('Request for help timed out.');
                    return;
                }
                var dataResponse = JSON.parse(response)
                if (dataResponse && dataResponse.messageBusError) {
                    reject(dataResponse.messageBusError)
                }
                resolve(dataResponse)
            })
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
            } catch(error) {
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