export default {
    dsn: process.env.SENTRY_DSN || '',
    debug: process.env.SENTRY_DEBUG === 'true',
    logLevel: Number(process.env.SENTRY_LOG_LEVEL || 1), // None = 0, Error = 1, Debug = 2, Verbose = 3
}
