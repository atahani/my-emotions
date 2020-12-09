import 'react-toastify/dist/ReactToastify.css'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import en from 'javascript-time-ago/locale/en'
import React from 'react'
import ReactDOM from 'react-dom'
import TimeAgo from 'javascript-time-ago'

import GlobalErrorBoundary from 'components/GlobalErrorBoundary'
import MainApp from 'containers/MainApp'

import { apolloClient } from 'utils/graphql/client'
import { GlobalStyled } from 'utils/style/global'

import * as serviceWorker from './serviceWorker'

TimeAgo.addLocale(en)

ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <BrowserRouter>
            <React.StrictMode>
                <GlobalStyled />
                <GlobalErrorBoundary>
                    <MainApp />
                </GlobalErrorBoundary>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </React.StrictMode>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
