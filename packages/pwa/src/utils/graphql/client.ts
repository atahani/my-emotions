import { ApolloClient, InMemoryCache } from '@apollo/react-hooks'
import { HttpLink } from '@apollo/client'

import { serverGraphqlUri } from 'utils/env'

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

export const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: serverGraphqlUri, credentials: 'include' }),
    cache,
})
