export default {
    debug: process.env.NODE_ENV === 'development',
    tracing: process.env.NODE_ENV === 'development',
    playground: process.env.ENABLE_GRAPHQL_PLAYGROUND === 'true',
}
