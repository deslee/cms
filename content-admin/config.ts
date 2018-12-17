import * as convict from 'convict'

export const config = convict({
    logHost: {
        doc: 'URL to the MongoDB server for logging',
        format: '*',
        default: 'mongodb://localhost:27017/winston',
        env: 'LOG_HOST'
    },
    logFile: {
        doc: 'File to log to',
        format: '*',
        default: './dev.log',
        env: 'LOG_FILE'
    },
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    natsUrl: {
        doc: 'URL to the NATS server',
        format: '*',
        default: 'nats://localhost:4222',
        env: "NATS_URL"
    },
    postgresPort: {
        doc: 'Port of the postgres server',
        format: Number,
        default: 5432,
        env: "POSTGRES_PORT"
    },
    postgresHost: {
        doc: 'Host of the postgres server',
        format: String,
        default: "localhost",
        env: "POSTGRES_HOST"
    },
    postgresUsername: {
        doc: 'Host of the postgres server',
        format: String,
        default: "postgres",
        env: "POSTGRES_USERNAME"
    },
    postgresPassword: {
        doc: 'Host of the postgres server',
        format: String,
        default: "localhost",
        env: "POSTGRES_PASS",
        sensitive: true
    },
})


config.validate({allowed: 'strict'});