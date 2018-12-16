export interface Command<T> {
    correlationId: string
    payload: T
}