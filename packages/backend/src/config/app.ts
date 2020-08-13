export default {
    environment: process.env.APP_ENVIRONMENT || 'local_development',
    graphqlEndpoint: process.env.GRAPHQL_URL || 'http://localhost:5050/graphql',
    port: Number(process.env.PORT || 5050),
}
