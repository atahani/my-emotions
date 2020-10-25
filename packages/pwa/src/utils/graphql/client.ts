import { ApolloClient, InMemoryCache } from '@apollo/react-hooks'
import { HttpLink } from '@apollo/client'

import { serverGraphqlUri } from 'utils/env'

export const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: serverGraphqlUri, credentials: 'include' }),
    cache: new InMemoryCache(),
})
