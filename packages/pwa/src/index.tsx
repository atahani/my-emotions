import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'

import MainApp from 'containers/MainApp'

import { GlobalStyled } from 'utils/style/global'
import { serverGraphqlUri } from 'utils/env'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <ApolloProvider
        client={new ApolloClient({ uri: serverGraphqlUri, credentials: 'include', cache: new InMemoryCache() })}
    >
        <BrowserRouter>
            <React.StrictMode>
                <GlobalStyled />
                <MainApp />
            </React.StrictMode>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
