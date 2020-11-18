import { ApolloClient, split, HttpLink, InMemoryCache } from '@apollo/react-hooks'
import { getMainDefinition } from '@apollo/client/utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from '@apollo/client/link/ws'

import { httpServerGraphqlUri, wsServerGraphqlUri } from 'utils/env'

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                emotions: {
                    keyArgs: ['userId'],
                    merge(existing = { items: [] }, incoming) {
                        return {
                            ...incoming,
                            items: [...existing.items, ...incoming.items],
                        }
                    },
                },
            },
        },
    },
})

const httpLink = new HttpLink({ uri: httpServerGraphqlUri, credentials: 'include' })
const wsLink = new WebSocketLink(new SubscriptionClient(wsServerGraphqlUri || '', { reconnect: true }))

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink as any,
    httpLink,
)

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache,
})
